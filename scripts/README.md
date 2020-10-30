## Archifiltre import script

### Description

Archifiltre provides you with an export script that you can run directly on your file server. It allows you to generate
a file that can be directly sent to an archivist. He will then be able to drop it into Archifiltre to analyze the file
tree.

The generated file will contain the following information :
- The absolute path of the exported folder on your file system
- The filesystem on which the export was ran (unix or windows)
- The absolute path of every file in the exported folder
- The size of every file in the exported folder
- The lastModificationDate of every file in the exported folder
- The MD5 hash of every file in the exported folder

### Usage

#### Windows

Get the powershell script in `./scripts/load-from-filesystem.ps1`. Then, from a powershell command, run : 
```
load-from-filesystem.ps1 path-to-the-exported-folder > file-to-export-to
```

An export file will be created at the `file-to-export-to` location.

#### Unix or MacOS

Get the bash script in `./scripts/load-filesystem.sh`. Then, from a bash command, run :
```
./load-filesystem.sh path-to-the-exported-folder > file-to-export-to
```

An export file will be created at the `file-to-export-to` location.

If you encounter execution rights errors, run the following command to set the execution rights for the script :
```
chmod u+x ./load-filesystem.sh
```
