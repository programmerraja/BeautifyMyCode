var beautifycss = require('js-beautify').css;
var beautifyhtml = require('js-beautify').html
var beautifyjs = require('js-beautify').js
var path = require("path");
var fs = require('fs');


function styleCode(file_name, language) {
  if (language === "js" || language === "css" || language === "ejs") {
    fs.readFile(file_name, 'utf8', function(err, data) {
      if (err) {
        throw err;
      }
      let code;
      if (language === "js") {
        code = beautifyjs(data, {
          indent_size: 2,
          space_in_empty_paren: true,

        });
      } else if (language === "css") {
        code = beautifycss(data, {
          indent_size: 2,
          space_in_empty_paren: true
        });
      } else if (language === "ejs") {
        code = beautifyhtml(data, {
          indent_size: 2,
          space_in_empty_paren: true
        });
      }
      if (code) {
        fs.writeFile(file_name, code, function(err) {
          if (err) throw err;
        });
      }
    });
  }
}

function ThroughDirectory(Directory) {
  //iterating the directory
  fs.readdirSync(Directory).forEach(File => {
    const Absolute = path.join(Directory, File);
    let name = Absolute.split("/");
    name = name[name.length - 1];
    //skipping the nodemodules and hidden folder
    if (fs.statSync(Absolute).isDirectory() && name != "node_modules" && !(name.startsWith("."))) {
      return ThroughDirectory(Absolute);
    } else {
      let file_name = Absolute.split("/");
      file_name = file_name.pop();
      let language = file_name.split(".")[1];
      styleCode(path.resolve(Absolute), language);
    }
  });
}
var Directory = process.argv.slice(2);
ThroughDirectory(Directory[0]);
console.log("Sucessfully Completed");