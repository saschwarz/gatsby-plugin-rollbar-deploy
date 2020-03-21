## Description

A Gatsby plugin that posts to Rollbar's deploy endpoint to signal your site has had its code updated.
It supplies the git short revision hash as the revision in Gatsby's onPostBuild workflow step.
Only triggered in production builds.

## How to install

Use `npm` to install

```
npm install gatsby-plugin-rollbar-deploy
```

or for `yarn`:

```
yard add gatsby-plugin-rollbar-deploy
```

### Configuration

An example `gatsby-config.js` configuration showing all the configuration options:
```
    {
      resolve: `gatsby-plugin-rollbar-deploy`,
      options: {
        accessToken: your-rollbar-server-token,
        environment: 'production',  // optional defaults to 'production'
        localUsername: 'gatsby',  // optional defaults to 'gatsby'
        ignoreErrors: true  // optional defaults to false
      }
    }
```

The only required option is `accessToken`.
Either paste your `ROLLBAR_SERVER_TOKEN` as a string or set it as an environment variable in your build environment and then use: `process.env.ROLLBAR_SERVER_TOKEN`

All other configuration parameters are optional.

`ignoreErrors`: defaults to `false` and raises an exception on Rollbar API errors. When set to `true` the Rollbar response is logged as an error and an exception is not thrown, so the post build step continues.


## Notes

The plugin executes `git` in a subshell to get the revision so `git` must be available on the path.
