var archiver = require("archiver");
var path = require("path");
var fs = require("graceful-fs");

const FINAL = "dist/";

function zipDirectory(source, out) {
  const archive = archiver("zip", { zlib: { level: 9 }});
  const stream = fs.createWriteStream(out);

  return new Promise((resolve, reject) => {
    archive
      .directory(source, false)
      .on("error", err => reject(err))
      .pipe(stream)
    ;

    stream.on("close", () => resolve());
    archive.finalize();
  });
}

function copyFileSync( source, target ) {
  if (source.endsWith(".ts")) return;
  var targetFile = target;
  // If target is a directory, a new file with the same name will be created
  if ( fs.existsSync( target ) ) {
      if ( fs.lstatSync( target ).isDirectory() ) {
          targetFile = path.join( target, path.basename( source ) );
      }
  }
  fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
  var files = [];
  // Check if folder needs to be created or integrated
  var targetFolder = path.join( target, path.basename( source ) );
  if ( !fs.existsSync( targetFolder ) ) {
    fs.mkdirSync(targetFolder,
      { recursive: true },
      (err) => {
        if (err) {
          return console.error(err);
        }
        console.log(`\x1b[31m Create Folder \x1b[34m : \x1b[33m ${targetFolder}\x1b[0m`);
    });
  }

  // Copy
  if ( fs.lstatSync( source ).isDirectory() ) {
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
  }
}


copyFolderRecursiveSync("./src/import", FINAL);
copyFolderRecursiveSync("./src/public", FINAL);
copyFolderRecursiveSync("./src/keys", FINAL);
copyFileSync( "./package.json", FINAL );

zipDirectory(FINAL, `./dist.zip`).then(function (e) {
    console.log(`\x1b[34m ${FINAL} \x1b[36m zip to ==> \x1b[37m dist.zip \x1b[0m`);
}); 