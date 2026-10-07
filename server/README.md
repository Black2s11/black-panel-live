# BLACK server API
These PHP files are source/deployment files for the x10hosting backend. GitHub Pages cannot execute PHP or MySQL.

Deploy the contents of server/api/ to public_html/api/ on the PHP host.

Required server-side secret:
BLACK_PANEL_API_KEY=<strong random secret>

The web panel calls:
https://loadervippub.x10.mx/api/keys_api.php

The Android app should validate keys through:
https://loadervippub.x10.mx/api/check_key.php

Database credentials stay only on the PHP host / CodeIgniter environment and must never be committed to this public repository.
