const proc = require('child_process')

exports.onPostBuild = function (_, pluginOptions) {
  if (process.env.NODE_ENV === 'production') {
    const localUserName = pluginOptions.localUserName || 'gatsby'

    const revision = proc.execSync('git rev-parse --short HEAD').toString().trim()

    const cmd = `curl --request POST --url https://api.rollbar.com/api/1/deploy/ \
--header 'content-type: application/json' \
-d '{"access_token": "${pluginOptions.accessToken}", "environment": "production", "revision": "${revision}", "local_username": "${localUserName}"}'`

    const result = proc.execSync(cmd, {
      stdio: [0, 1, 2]
    })
    console.log("Rollbar deploy results:", result)
  }
}