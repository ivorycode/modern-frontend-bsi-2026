# Course Preparation
Please prepare your laptop before the course with the following steps.

### Overview:

The following steps are needed for the setup. Below are detailed informations for each of the steps.

1. Install Git
2. Install NodeJS
3. Install Chrome
4. Install an editor. Recommended: *IntelliJ Ultimate*, *Rider* or *WebStorm* or *Visual Studio Code*
5. Clone the repo: `https://github.com/ivorycode/modern-frontend-bsi-2026`
6. In the repository in `01-Starter/vanilla-vite` run `npm install` and then `npm run dev`

If you have any questions or problems concerning the instructions below, please contact: jonas.bandi@ivorycode.com

### Important:

Make sure that you have **unrestricted access to the internet**! In the steps below you will have to access *GitHub* and *npmjs.org*. Some corporate proxies block these sites or block access over https or git!

If you are already using node/npm, make sure that you __don't__ have a global npm-proxy configured. (Check: `npm config get proxy` should return `null`). If it does not return `null`, then you should probably comment out the corresponding proxy in the file `.npmrc` in your home or profile directory.

You can also use your private laptop for the course, as long as you can access the internet.




## Software Installation
For the workshop the following software should be installed.  

**The version numbers don't have to match exactly, but they should be pretty close!**



### Git

A recent git installation is needed to download the sample code and exercises.  
Git can be downloaded from here: <https://git-scm.com/download/>

Check:  

 ```
 git --version                                                             
 git version 2.53npm --.0
 ```



### Node.js & NPM 
Node and NPM are the fundament for the JavaScript toolchain.  
The Node installer can be downloaded here: <https://nodejs.org/>

Install a recent version of Node.js.  

Check:

```
> node --version
v24.1.0
> npm --version
11.5.2
```



### Browser

A recent modern browser must be available. Recommended: Chrome.



### Optional:  A good editor for web development

[IntelliJ IDEA Ultimate](https://www.jetbrains.com/idea/),  [WebStorm](http://www.jetbrains.com/webstorm), [Rider](https://www.jetbrains.com/rider/) or [Visual Studio Code](https://code.visualstudio.com/) are all very good IDEs/editors for web development.  
Notes: 

- WebStorm supports the same features as IntelliJ IDEA Ultimate or Rider for frontend development.
- Note: IntelliJ IDEA without Ultimate Subscription is missing some features for frontend development.
- The recent crop of AI editors also has good support for web development: [Cursor](https://cursor.com/), [Windsurf](https://windsurf.com/), [Kiro](https://kiro.dev/), [TRAE](https://www.trae.ai/) 

None of these editors are a requirement for the workshop. It is up to the attendees to use any other editor of their preference. The examples and demos will be shown with WebStorm. 



## Course Material

All the course material will be provided in the following repository:

	https://github.com/ivorycode/modern-frontend-bsi-2026

Please clone the repo like this:

	git clone https://github.com/ivorycode/modern-frontend-bsi-2026.git


To update the repo later (please update the repo in the morning of the workshop):

```
cd modern-frontend-bsi-2026
git pull
```



## Run the intro example

Start the intro example in order to check that the environment is set up correctly, 

```
cd 01-Starter/vanilla-vite
npm install
npm run dev
```

The last command starts a [Vite](https://vite.dev/) development web server, serving the intro application at `http://localhost:5173/`.  
Open a browser at `http://localhost:5173/` -> a page with a simple counter-button should be shown.

