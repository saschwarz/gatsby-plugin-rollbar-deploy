const proc = require('child_process')
const https = require('https')

const rollbarDeploy = (payload) => {
  return new Promise((resolve, reject) => {

    const options = {
      hostname: 'api.rollbar.com',
      port: 443,
      path: '/api/1/deploy/',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': payload.length
      }
    }

    const req = https.request(options, res => {
      var data = []
      res.on('data', d => {
        data.push(d)
      })
      res.on('end', d => {
        const result = JSON.parse(data.join(''))
        resolve(result)
      })
    })

    req.on('error', error => {
      reject(error)
    })
    req.write(payload)
    req.end()
  })
}

exports.onPostBuild = async function (_, pluginOptions) {

  if (process.env.NODE_ENV === 'production') {
    const localUserName = pluginOptions.localUserName || 'gatsby'
    const environment = pluginOptions.environment || process.env.NODE_ENV

    const revision = proc.execSync('git rev-parse --short HEAD').toString().trim()

    const payload = JSON.stringify(
      {
        access_token: pluginOptions.accessToken,
        environment: environment,
        revision: revision,
        local_username: localUserName
      }
    )

    results = await rollbarDeploy(payload)
    if (results.err) {
      const msg = `Rollbar deploy error: ${JSON.stringify(results)}`
      if (pluginOptions.ignoreErrors) {
        console.error('IGNORING', msg)
      } else {
        throw new Error(msg)
      }
    } else {
      console.log("Rollbar Deploy Success: ", results)
    }
  }
}