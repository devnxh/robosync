module.exports = {
  appId: 'com.robosync.app',
  productName: 'RoboSync',
  copyright: `Copyright © ${new Date().getFullYear()} RoboSync Contributors`,
  directories: {
    output: 'release',
    buildResources: 'assets',
  },
  files: ['out/**/*'],
  win: {
    icon: 'assets/icon.ico',
    artifactName: '${productName}-${version}-${arch}.${ext}',
    requestedExecutionLevel: 'highestAvailable',
    target: [
      { target: 'nsis', arch: ['x64'] },
      { target: 'portable', arch: ['x64'] },
    ],
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true,
    shortcutName: 'RoboSync',
    installerIcon: 'assets/icon.ico',
    uninstallerIcon: 'assets/icon.ico',
    artifactName: '${productName}-Setup-${version}.${ext}',
  },
  publish: null,
}
