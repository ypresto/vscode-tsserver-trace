# vscode-tsserver-tracer README

Take a trace (`--generateTrace`) of a **running** TypeScript server (tsserver) instance used by vscode, **without restarting it**.
This trace is useful for debugging performance issues related to the editing experience, such as lags in completion and diagnostics.

## Usage

1. Run `TypeScript: Start tracing in tsserver` from command palette.
2. Once started, reproduce the operation that has performance issues. For example you insert a character in a heavy file.
3. Wait for a while until the tsserver becomes idle. You can wait for syntax errors to appear as diagnostics.
4. Run `TypeScript: Stop tracing in tsserver` from command palette.
5. Automatically opens a directory with `trace.json` and `types.json`.
6. Go to [https://ui.perfetto.dev/].
7. Click `Open trace file` then upload `trace.json`.

See below URL for more details for analyzing trace files.
[https://github.com/microsoft/TypeScript-wiki/blob/main/Performance-Tracing.md]

## Known Issues

- **Vue extension**: Hybrid Mode will be automatically disabled (because this plugin installs tsserver plugin). You should re-enable it by change `Vue › Server: Hybrid Mode` setting from `auto` to `true`.

## Release Notes

### 0.0.1

Initial release
