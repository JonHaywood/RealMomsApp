#How to Deploy

This document handles how to deploy the Real Moms app to the free hosting platform [Heroku](http://heroku.com).

##Set up
First make sure you are able to run the app locally before attempting to deploy it. Once you are able to run it successfully you can be sure all the required files will be pushed correctly.

Using the command line, navigate to where the app is located on your computer.
```
C:\>cd /path/to/app
```

Next, follow [these steps](https://devcenter.heroku.com/articles/getting-started-with-nodejs#set-up) for setting up Heroku locally. First download the Heroku toolbelt. Then use the heroku login command to set up your credentials. (NOTE: if you don't have a login contact an administrator to get one)

##Prepare the app

Heroku links your projects locally with apps on their platform by using a remote git repository. To add a Heroku remote as a remote for your local repository use the following command:

```
git remote add heroku https://git.heroku.com/realmoms.git
```

Or if you're not using the command line but another git tool, use that tool to add a remote with a name of `heroku` and a location of `https://git.heroku.com/realmoms.git`. You can check if the remote was added successfully by using the command `git remote -v` to see a list of remotes. You should see something similar to this:

```
D:\Projects\RealMomsApp>git remote -v
heroku  https://git.heroku.com/realmoms.git (fetch)
heroku  https://git.heroku.com/realmoms.git (push)
origin  https://github.com/JonHaywood/RealMomsApp.git (fetch)
origin  https://github.com/JonHaywood/RealMomsApp.git (push)
```

##Deploy the app

The source folder contains everything needed to run the app. To push those files up to Heroku, use the `heroku_deploy` batch file.
```
D:\Projects\RealMomsApp>heroku_deploy
```

This will use git to push the source folder live. If you're not on Windows then you can run the following command to accomplish the same thing:
```
git subtree push --prefix source heroku master
```

It will take a minute or two, but near the end you should see output similar to this if it pushed successfully:
```
remote:        ├── gulp-rm@1.0.0
remote:        ├── main-bower-files@2.9.0
remote:        ├── mongoose@4.1.0
remote:        ├── underscore@1.8.3
remote:        └── vash@0.9.3
remote:
remote: -----> Discovering process types
remote:        Procfile declares types -> web
remote:
remote: -----> Compressing... done, 26.9MB
remote: -----> Launching... done, v6
remote:        https://realmoms.herokuapp.com/ deployed to Heroku
remote:
remote: Verifying deploy.... done.

Warning: Your console font probably doesn't support Unicode. If you experience s
trange characters in the output, consider switching to a TrueType font such as L
ucida Console!
To https://git.heroku.com/realmoms.git
   55c2ff9..f829d95  f829d9548ea4737836628cdf42ceb7e2dff6cb2e -> master
```

Lastly, use the command `heroku open` to launch a web browser to see the live app.