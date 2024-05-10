import ts from 'typescript/lib/tsserverlibrary';
import fs from 'fs';

type TSExtend = typeof ts & {
  startTracing: (tracingMode: 'build' | 'project' | 'server', traceDir: string, configFilePath?: string) => void;
  tracing: { stopTracing: () => void } | undefined;
};

function init(modules: { typescript: TSExtend }): ts.server.PluginModule {
  const ts = modules.typescript;

  let logger: ts.server.Logger | undefined = undefined;

  function create(info: ts.server.PluginCreateInfo) {
    logger = info.project.projectService.logger;

    const proxy = { ...info.languageService };

    return proxy;
  }

  let traceDir: string | undefined = undefined;

  function onConfigurationChanged(config: { traceDir?: string }) {
    logger?.info('tsserver-tracer-plugin: onConfigurationChanged');
    if (config.traceDir) {
      traceDir = config.traceDir;
      if (ts.tracing) {
        logger?.info('tsserver-tracer-plugin: tracing already started');
      } else {
        logger?.info('tsserver-tracer-plugin: startTracing');
        ts.startTracing('project', traceDir);
        fs.writeFileSync(`${traceDir}/.tsserver-tracer-plugin.lock`, '');
      }
    } else {
      setTimeout(() => {
        if (ts.tracing) {
          logger?.info('tsserver-tracer-plugin: stopTracing');
          ts.tracing.stopTracing();
          fs.unlinkSync(`${traceDir}/.tsserver-tracer-plugin.lock`);
          traceDir = undefined;
        } else {
          logger?.info('tsserver-tracer-plugin: tracing not started');
        }
      });
    }
  }

  return { create, onConfigurationChanged };
}

export = init;
