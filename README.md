# vscode-tsserver-tracer README

## Features

Take a trace of the TypeScript server instance used by vscode, **without restarting it**.
It is useful for debugging performance issue of editing experience.

Available commands are:

- TypeScript: Start tracing in tsserver
- TypeScript: Stop tracing in tsserver

## Requirements

TypeScript feature is enabled in vscode.

## Extension Settings

Currently no config.

## Known Issues

## Release Notes

### 0.0.1

Initial release

## TODO

- Some nice UI to show profiling is in progress.
- Automatically open [perfetto](https://ui.perfetto.dev/). This requires http server.
- Fill trace.json with type information retrieved from types.json .
- Instant trace does not show up in non-legacy perfetto UI. Convert it somehow.
