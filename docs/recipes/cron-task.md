# Run gulp task via cron job

While logged in via a user that has privileges to run `gulp`, run the following:

    crontab -e
    
to edit your current "[crontab](https://en.wikipedia.org/wiki/Cron)" file.

Typically, within a cron job, you want to run any binary using absolute paths,
so an initial approach to running `gulp build` every minute might look like:

    * * * * * cd /your/dir/to/run/in && /usr/local/bin/gulp build

However, you might see in the cron logs that you get this error:

> `/usr/bin/env: node: No such file or directory`

To fix this, we need to add a [symbolic link](https://en.wikipedia.org/wiki/Ln_\(Unix\))
within `/usr/bin` to point to the actual path of our node binary.

Be sure you are logged in as a **sudo** user, and paste in the following command to your terminal:

    sudo ln -s $(which node) /usr/bin/node

Once this link is established, your cron task should run successfully.
