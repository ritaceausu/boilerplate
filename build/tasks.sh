#!/bin/bash

TASK=$1

branch_name() {

  name="$(git symbolic-ref HEAD 2>/dev/null)" ||
  name="(unnamed branch)"     # detached HEAD

  name=${name##refs/heads/}
  echo $name
}


deploy() {

  status=$(git status --porcelain)

  if [[ ! -z $status ]]; then
    echo "Please commit the following changes before running the deploy command:
$status
"
    exit;

  fi

  branch=$(branch_name)

  git checkout release
  git reset --hard 073f515
  git checkout $branch

  npm run build
  mv dist dist.bkp
  git checkout release
  rm -r dist
  mv dist.bkp dist

  status=$(git status --porcelain)
  if [[ -z $status ]]; then
    echo "Dist folder did not change. Deploy aborted."
    git checkout $branch
    exit;
  fi

  git add dist/*
  git commit -m "Release"
  git push -f
  git checkout $branch

  echo "Deploy complete"

}

$TASK
