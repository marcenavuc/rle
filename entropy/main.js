var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
if (!fileSystem.FileExists("in.txt")) {
    WScript.Echo("Can`t find file in.txt")
    WScript.Quit();
}
var file = fileSystem.OpenTextFile("in.txt",1,true,-1); 
var text = file.ReadAll();
file.Close();

//if command arguments is empty 
if(text.length < 1){ 
    WScript.Echo("Error: not enought symbols in in.txt");
    WScript.Quit();
}

var dict = {};
for (var i = 0; i < text.length; i++) {
    dict[text.charAt(i)] = 0;
}
for (var i = 0; i < text.length; i++) {
    dict[text.charAt(i)]++;
}
var result = 0;
for (var key in dict) {
    dict[key] = dict[key] / text.length;
    if (Math.log(text.length) != 0)
        result -= dict[key] * Math.log(dict[key]) / Math.log(text.length);
}
WScript.Echo(result);