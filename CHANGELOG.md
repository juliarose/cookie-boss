# Changelog

## [1.0.1] - 2019-02-22
### Fixed
- A bug when storing invalid cookies would cause a "Maximum call stack size exceeded" error when calling toJSON method.

### Changed
- Made "store" prototype method safer from storing bad data.

### Added
- "fromJSON" prototype method.
- "getCookies" prototype method.