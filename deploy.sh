#!/bin/bash

# DESPLEGA REPOSITORI AL SERVIDOR
# només desplegar la branca master si està ben testejada

# només desplega la branca master
branca_actual=`git branch --show-current`
if [[ $branca_actual != 'master' ]]; then
  echo "ERROR: no estàs a la branca master"
  exit 1;
fi

#nou commit
git add *
git commit
git push

#sincronitza
folder="/var/www/vhosts/h2793818.stratoserver.net/remapp.icra.cat"
rsync -h -P -vv -r . root@h2793818.stratoserver.net:$folder
