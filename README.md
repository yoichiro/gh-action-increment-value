# Increment a value GitHub Actions

This GitHub Actions increments a value written in a file specified by condition automatically.

# How to Use

If you have the `build-number.json` file below in the `foobar/baz` directory:

```text
{"buildNumber":3}
```

The example of the `increment.yaml` YAML file in the `.github/workflows` directory is the following:

```yaml
name: Increment value test
on:
  push:
    branches:
      - main
jobs:
  test:
    name: Increment value test
    runs-on: ubuntu-latest
    steps:
      - name: Check out source code
        uses: actions/checkout@v2
        with:
          ref: ${{ github.ref }}
      - name: Increment value
        uses: yoichiro/gh-action-increment-value@main
        with:
          target_directory: 'foobar/baz'
          target_file: 'build_number.json'
          prefix: 'buildNumber":'
          suffix: '}'
          commit_message: 'Increment the build number to '
```

* target_directory - The directory path where there is the target file.
* target_file - The target file name.
* prefix - The prefix string to determine the start position of the target number.
* suffix - The suffix string to determine the end position of the target number.
* commit_message - The commit message (automatically the number appended.).
