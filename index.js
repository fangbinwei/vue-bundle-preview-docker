const path = require('path')
const Docker = require('dockerode')
const portfinder = require('portfinder')
const ip = require('ip')
const docker = new Docker()

async function main() {
  let stream = await docker.buildImage(
    './example.tar',
    {
      t: 'fang/vue-example',
      buildargs: {
        publicPath: '/template',
      },
    },
    function (error, output) {
      if (error) {
        return console.error(error)
      }
      output.pipe(process.stdout)
      output.on('end', async function () {
        // FIXME: process.stdout may contains error message
        console.log('end')
        await run()
      })
    }
  )
}
async function run() {
  const port = await portfinder.getPortPromise()
  docker
    .run(
      'fang/vue-example',
      [],
      process.stdout,
      {
        name: 'test',
        HostConfig: {
          AutoRemove: true,
          PublishAllPorts: true,
          PortBindings: {
            '80/tcp': [
              {
                HostPort: String(port)
              }
            ]
          }
        },
      },
      function (err, data, container) {
        // after stop
        if (err) console.error('err', err)
        console.log(data, container)
      }
    )
    .on('container', async function (container) {
      // const data = await container.inspect()
      console.log(`http://${ip.address()}:${port}/template`)
    })
}

main()
