# Motivation for building this
It's hard to find my projects because they're scattered, some are on github, others only on some computer.  


With this project I aim to solve this by bringing together all personal side projects that I build using typescript on the same place, so I don't lose track of the projects and maybe I have some fun mixing some of the functionalities I'm learning about.

# Pages & Functionalities
`/` Signin -> Social Login with Discord
`/images`  -> Upload and Download Images from S3
`/chatroom`-> Real time video chat using WebRTC (needs a [webRTC server](https://github.com/DaviRolim/simpleWebRTC-server) in order to connect the peers)


# Getting started running this app
- export AWS_REGION=us-east-1 && export AWS_ACCESS_KEY_ID=<AWSKEY> && export AWS_SECRET_ACCESS_KEY=<AWSSECRET>
- To enable social login set the DISCORD keys on .env (check .env.example) for more information, check [this doc](https://create.t3.gg/en/usage/next-auth#setting-up-the-default-discordprovider).
- Finally run `npm run dev`