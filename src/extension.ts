import * as vscode from 'vscode';
import fs from 'fs/promises';

const tmpPrefix = '/tmp/tsserver-tracer-plugin-';

let api: any = undefined;
let traceDir: string | undefined = undefined;

export async function activate(context: vscode.ExtensionContext) {
  // Get the TS extension
  const tsExtension = vscode.extensions.getExtension('vscode.typescript-language-features');
  if (!tsExtension) {
    return;
  }

  await tsExtension.activate();

  // Get the API from the TS extension
  if (!tsExtension.exports || !tsExtension.exports.getAPI) {
    return;
  }

  let api = tsExtension.exports.getAPI(0);
  if (!api) {
    return;
  }

  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-tsserver-tracer.startTracing', async () => {
      if (traceDir) {
        vscode.window.showInformationMessage('Trace already started');
        return;
      }

      const result = await vscode.window.withProgress(
        {
          title: 'Start tracing',
          location: vscode.ProgressLocation.Notification,
        },
        async () => {
          traceDir = await fs.mkdtemp(tmpPrefix);

          api.configurePlugin('tsserver-tracer-plugin', { traceDir });

          return await waitFor(
            () =>
              fs
                .access(`${traceDir}/.tsserver-tracer-plugin.lock`)
                .then(() => true)
                .catch(() => false),
            10000
          );
        }
      );

      if (result) {
        vscode.window.showInformationMessage('Trace started');
      } else {
        vscode.window.showInformationMessage('Failed to start tracing');
      }
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand('vscode-tsserver-tracer.stopTracing', async () => {
      if (!traceDir) {
        vscode.window.showInformationMessage('Trace not started');
      }

      const result = await vscode.window.withProgress(
        {
          title: 'Stop tracing',
          location: vscode.ProgressLocation.Notification,
        },
        async () => {
          api.configurePlugin('tsserver-tracer-plugin', { traceDir: undefined });

          return await waitFor(
            () =>
              fs
                .access(`${traceDir}/.tsserver-tracer-plugin.lock`)
                .then(() => false)
                .catch(() => true),
            20000
          );
        }
      );

      if (result) {
        vscode.window.showInformationMessage('Trace stopped');
        const { default: open } = await import('open');
        open(traceDir!);
        traceDir = undefined;
      } else {
        vscode.window.showInformationMessage('Failed to stop tracing');
      }
    })
  );
}

export function deactivate() {
  if (traceDir) {
    api?.configurePlugin('tsserver-tracer-plugin', { traceDir: undefined });
  }
}

function waitFor(check: () => Promise<boolean>, timeout: number): Promise<boolean> {
  const startTime = Date.now();
  return new Promise((resolve) => {
    const run = () => {
      check().then((result) => {
        if (result) {
          resolve(true);
          return;
        }
        if (Date.now() - startTime > timeout) {
          resolve(false);
          return;
        }

        setTimeout(run, 100);
      });
    };
    run();
  });
}
