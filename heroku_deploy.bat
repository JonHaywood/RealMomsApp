@echo off
:: The following command will only push the source folder to heroku
:: since heroku expects everything to be in the in the root folder.
git subtree push --prefix source heroku master