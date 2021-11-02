<p align="center">
  <a href="https://www.budibase.com">
    <img alt="Budibase" src="https://d33wubrfki0l68.cloudfront.net/aac32159d7207b5085e74a7ef67afbb7027786c5/2b1fd/img/logo/bb-emblem.svg" width="60" />
  </a>
</p>
<h1 align="center">
  Budibase
</h1>

<h3 align="center">
  Build business apps 50x faster
</h3>
<p align="center">
  Budibase is an open-source low-code platform that helps developers and IT professionals design, build, and ship business apps 50x faster.
</p>

<h3 align="center">
 🤖 🎨 🚀
</h3>


<p align="center">
  <img src="https://i.imgur.com/tMCahK8.png">
</p>

<p align="center">
  <a href="https://github.com/Budibase/budibase/releases">
    <img alt="GitHub all releases" src="https://img.shields.io/github/downloads/Budibase/budibase/total">
  </a>
  <a href="https://github.com/Budibase/budibase/releases">
    <img alt="GitHub release (latest by date)" src="https://img.shields.io/github/v/release/Budibase/budibase">
  </a>
  <a href="https://discord.gg/rCYayfe">
    <img alt="Discord" src="https://img.shields.io/discord/733030666647765003">  
  </a>
  <a href="https://twitter.com/intent/follow?screen_name=budibase">
    <img src="https://img.shields.io/twitter/follow/budibase?style=social" alt="Follow @budibase" />
  </a>
</p>

<h3 align="center">
  <a href="https://portal.budi.live/signup">Sign-up</a>
  <span> · </span>
  <a href="https://docs.budibase.com">Docs</a>
  <span> · </span>
  <a href="https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas">Feature request</a>
  <span> · </span>
  <a href="https://github.com/Budibase/budibase/issues">Report a bug</a>
  <span> · </span>
  Support: <a href="https://github.com/Budibase/budibase/discussions">Discussions</a>
  <span> & </span>
  <a href="https://discord.gg/rCYayfe">Discord</a>
</h3>


## ✨ Features
When other platforms chose the closed source route, we decided to go open source. When other platforms chose cloud builders, we decided a local builder offered the better developer experience. We like to do things differently at Budibase. 

- **Build and ship real software.** Unlike other platforms, with Budibase you build and ship single page applications. Budibase applications have performance baked in and can be designed responsively, providing your users with a great experience. 

- **Open source and extensable.** Budibase is open-source. The builder and server are AGPL v3, and the client is MPL. This should fill you with confidence that Budibase will always be around. You can also code against Budibase or fork it and make changes as you please, providing a developer-friendly experience.

- **Load data or start from scratch.** Budibase pulls in data from multiple sources, whether it’s a CSV, an external database, or a REST API. And unlike other platforms, with Budibase you can start from scratch and create business apps with no data sources. [Request new data sources](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Design and build apps with powerful pre-made components.** Budibase comes out of the box with beautifully designed, powerful components which you can use like building blocks to build your UI. We also expose a lot of your favourite CSS styling options so you can go that extra creative mile. [Request new components](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Automate processes, integrate with other tools, and connect to webhooks.** Save time by automating manual processes and workflows. From connecting to webhooks, to automating emails, simply tell Budibase what to do and let it work for you. You can easily [create new automations for Budibase here](https://github.com/Budibase/automations) or [request new integrations here](https://github.com/Budibase/budibase/discussions?discussions_q=category%3AIdeas).

- **Cloud hosting and self-hosting (coming soon) available.** Users will soon have the option to host with Budibase in AWS (available now) or self-host (coming very soon). From the very beginning, we wanted our users to have the option to self-host. We understand the importance of having full control over data. This is why we are working incredibly hard to offer an easy path to self-hosting. If you are interested in self-hosting, please [join the conversation and add your thoughts](https://github.com/Budibase/budibase/discussions/648).


## ⌛ Status
- [x] Alpha: We are demoing Budibase to users and receiving feedback
- [x] Private Beta: We are testing Budibase with a closed set of customers
- [x] Public Beta: Anyone can [sign-up and use Budibase](https://portal.budi.live/signup) but it's not production ready. We cannot ensure backwards compatibility
- [ ] Official Launch: Production-ready


We are currently in Public Beta. Until our official launch, we cannot ensure backwards compatibility for your Budibase applications between versions. Issues may arise when trying to edit apps created with old versions of the Budibase builder.

Watch "releases" of this repo to get notified of major updates, and give the star button a click whilst you're there. 

<p align="center">
  <img src="https://i.imgur.com/cJpgqm8.png">
</p>

If you are having issues between updates of the builder, please use the guide [here](https://github.com/Budibase/budibase/blob/master/CONTRIBUTING.md#troubleshooting) to clear down your environment.


## 🏁 Getting Started with Budibase

The Budibase builder runs in Electron, on Mac, PC and Linux. [Sign-up here](https://portal.budi.live/signup) or [Download the latest release](https://github.com/Budibase/budibase/releases), and start building!

<p align="center">
  <img alt="Budibase design ui" src="https://imgur.com/v8m6v3q.png">
</p>


## 🎓 Learning Budibase

Our documentation and tutorials live here: https://docs.budibase.com

## 🙌 Contributing to Budibase

From opening a bug report to creating a pull request: every contribution is appreciated and welcomed. If you're planning to implement a new feature or change the API please create an issue first. This way we can ensure your work is not in vain.

### Not Sure Where to Start?
Budibase is a monorepo managed by lerna. Lerna manages the building and publishing of the budibase packages. At a high level, here are the packages that make up budibase.

- packages/builder - contains code for the budibase builder client side svelte application.

- packages/client - A module that runs in the browser responsible for reading JSON definition and creating living, breathing web apps from it.

- packages/server - The budibase server. This Koa app is responsible for serving the JS for the builder and budibase apps, as well as providing the API for interaction with the database and file system.

For more information, see [CONTRIBUTING.md](./CONTRIBUTING.md)

## 📝 License

Budibase is open-source. The builder is licensed [AGPL v3](https://www.gnu.org/licenses/agpl-3.0.en.html), the server is [GPL v3](https://www.gnu.org/licenses/gpl-3.0.en.html), and the client is [MPL](https://directory.fsf.org/wiki/License:MPL-2.0).

## 💬 Get in touch

If you have a question or would like to talk with other Budibase users, please hop over to [Github discussions](https://github.com/Budibase/budibase/discussions) or join our Discord server:

[Discord chatroom](https://discord.gg/rCYayfe)

![Discord Shield](https://discordapp.com/api/guilds/733030666647765003/widget.png?style=shield)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="http://martinmck.com"><img src="https://avatars1.githubusercontent.com/u/11256663?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Martin McKeaveney</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=shogunpurple" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=shogunpurple" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=shogunpurple" title="Tests">⚠️</a> <a href="#infra-shogunpurple" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="http://www.michaeldrury.co.uk/"><img src="https://avatars2.githubusercontent.com/u/4407001?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Drury</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=mike12345567" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=mike12345567" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=mike12345567" title="Tests">⚠️</a> <a href="#infra-mike12345567" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td>
    <td align="center"><a href="https://github.com/aptkingston"><img src="https://avatars3.githubusercontent.com/u/9075550?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Andrew Kingston</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=aptkingston" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=aptkingston" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=aptkingston" title="Tests">⚠️</a> <a href="#design-aptkingston" title="Design">🎨</a></td>
    <td align="center"><a href="https://budibase.com/"><img src="https://avatars3.githubusercontent.com/u/3524181?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Michael Shanks</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=mjashanks" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=mjashanks" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=mjashanks" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/kevmodrome"><img src="https://avatars3.githubusercontent.com/u/534488?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Kevin Åberg Kultalahti</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=kevmodrome" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=kevmodrome" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=kevmodrome" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://www.budibase.com/"><img src="https://avatars2.githubusercontent.com/u/49767913?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joe</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=joebudi" title="Documentation">📖</a> <a href="https://github.com/Budibase/budibase/commits?author=joebudi" title="Code">💻</a> <a href="#content-joebudi" title="Content">🖋</a> <a href="#design-joebudi" title="Design">🎨</a></td>
    <td align="center"><a href="https://github.com/Conor-Mack"><img src="https://avatars1.githubusercontent.com/u/36074859?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Conor_Mack</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=Conor-Mack" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=Conor-Mack" title="Tests">⚠️</a></td>
  </tr>
  <tr>
    <td align="center"><a href="https://github.com/pngwn"><img src="https://avatars1.githubusercontent.com/u/12937446?v=4?s=100" width="100px;" alt=""/><br /><sub><b>pngwn</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=pngwn" title="Code">💻</a> <a href="https://github.com/Budibase/budibase/commits?author=pngwn" title="Tests">⚠️</a></td>
    <td align="center"><a href="https://github.com/HugoLd"><img src="https://avatars0.githubusercontent.com/u/26521848?v=4?s=100" width="100px;" alt=""/><br /><sub><b>HugoLd</b></sub></a><br /><a href="https://github.com/Budibase/budibase/commits?author=HugoLd" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
