module.exports = {
  transformer: {
    '*.{ts,tsx}': '@parcel/transformer-typescript-types'
  },
  resolver: '@parcel/resolver-default',
  bundler: '@parcel/bundler-default',
  namer: '@parcel/namer-default',
  runtimes: {
    'service-worker': {
      packageName: '@parcel/runtime-service-worker',
      resolveFrom: __filename
    }
  },
  packager: {
    '*.{html,htm}': '@parcel/packager-html',
    '*.js': '@parcel/packager-js',
    '*.css': '@parcel/packager-css'
  },
  optimizer: {
    '*.js': '@parcel/optimizer-terser',
    '*.css': '@parcel/optimizer-cssnano'
  },
  compressor: '@parcel/compressor-gzip',
  reporter: ['@parcel/reporter-cli', '@parcel/reporter-dev-server']
};