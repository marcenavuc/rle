var args = WScript.Arguments;
var fileSystem = new ActiveXObject("Scripting.FileSystemObject");

function CheckFileExist(filename){
    var res = true;
    if (!fileSystem.FileExists(filename)) { //Если файла нет
        res = false;
        WScript.Echo("Absent " + filename); 
        WScript.Quit();
    }
    return res
}

function AddChars(char, counts){
    var result = "";
    for(var i = 0; i < counts; i++){
        result += char;
    }
    return result;
}

//if command arguments is empty 
if(WScript.Arguments.Length < 2){ 
    WScript.Echo("Error: not enought arguments. Please, read README.md");
    WScript.Quit();
}

//help about command
if(args(0) == "/?") { 
    WScript.Echo("Please, read README.md for help inforamtion");
    WScript.Quit();
}

// escape encoder
if (args(0)=="escape" && args(1)=="encode" && CheckFileExist("in.txt")) {
    var file = fileSystem.OpenTextFile("in.txt", 1, false, -1);
	var text = file.ReadAll();
	file.Close();
    var result = "";
    var countRepeat = 1;
    var repeatedSign = text.charAt(0);
    var latentChar = "#";
	for (var i = 1; i <=text.length; i++) {
		if (repeatedSign == text.charAt(i)) 
            countRepeat++; 
        else { 
			if (latentChar == repeatedSign) 
				text += latentChar + String.fromCharCode(countRepeat) + latentChar; 
			else if (countRepeat <= 3)
                for (var j = 0; j < countRepeat; j++) result += repeatedSign;
            else
                result += latentChar + String.fromCharCode(countRepeat - 3 ) + repeatedSign;
            
			repeatedSign = text.charAt(i);
			countRepeat = 1;
		}
    }
    var f = fileSystem.OpenTextFile("encoded.txt", 2, true, -1);
	f.WriteLine(latentChar);
	f.Write(result);
    WScript.Quit();
}

if (args(0)=="escape" && args(1)=="decode" && CheckFileExist("encoded.txt")) {
    var file = fileSystem.OpenTextFile("encoded.txt", 1, true, -1);
	var latentChar = file.ReadLine(); 
	var text = file.ReadAll();
	file.Close();
	var result = "";
	for (var i = 0; i < text.length; i++) {
		if (text.charAt(i) != latentChar){
            result += text.charAt(i);
        }
		else { 
			for (var j = 1; j <= text.charCodeAt( i + 1 ) + 3 ; j++)
			    result += text.charAt( i + 2 );
			i += 2;
	    }
    }
    var f = fileSystem.OpenTextFile("out.txt",2,1,-1);
	f.Write(result);
	f.Close();
    WScript.Quit();
}

if (args(0)=="jump" && args(1)=="encode" && CheckFileExist("in.txt")) {
    var file = fileSystem.OpenTextFile("in.txt",1,true,-1); 
	var text = file.ReadAll();
    file.Close();
    var isRepeated = text.charAt(0) == text.charAt(1)
	var repeatedSign = text.charAt(0); 
	var count = 1;
	var result = "";
	for (var i = 1; i < text.length; i++) { 
		if (isRepeated && text.charAt(i) == text.charAt( i + 1 )) {
			count++;
		} else if (isRepeated && text.charAt(i + 1) != text.charAt(i)) { // если буквы не совпадают
			count++;
			while (count >= 127) {
				result += String.fromCharCode(127) + repeatedSign;
				count -= 127;
			}
			if (count != 0) 
			    result += String.fromCharCode(count) + repeatedSign;
            count = 0;
            isRepeated = text.charAt(i + 1) == text.charAt(i + 2)
            repeatedSign = text.charAt(i + 1) == text.charAt(i + 2) ? text.charAt(i + 1) : "";
		} else if (!isRepeated && text.charAt(i) != text.charAt(i + 1)) {
			repeatedSign += text.charAt(i);
			count++;
		} else if (!isRepeated && text.charAt(i) == text.charAt(i + 1)) {
			result += String.fromCharCode(127 + count) + repeatedSign;
			isRepeated = !isRepeated;
			count = 1;
			repeatedSign = text.charAt(i);
		}
    }
	var f = fileSystem.OpenTextFile("encoded.txt",2,true,-1);
	var text = f.Write(result);		
    f.Close();
    WScript.Quit();
}

if (args(0)=="jump" && args(1)=="decode" && CheckFileExist("encoded.txt")) {
    var file = fileSystem.OpenTextFile("encoded.txt", 1, true, -1);
    var text = file.ReadAll();
    file.Close();
    var result="";
	var i=0;
	var currentSign;
	while (i < text.length) {
        currentSign = text.charCodeAt(i);
		if ( currentSign <= 127) {
			for (var b = 0; b < currentSign; b++) 
				result += text.charAt(i + 1);
			i += 2;
		} else {
			currentSign = text.charCodeAt(i) - 127;
			for (var b=0; b < currentSign; b++) {
				i++;
				result += text.charAt(i);
			}
			i++;
		}
	}
	var f = fileSystem.OpenTextFile("out.txt", 2, true, -1); //Вывод
	f.Write(result);		
    f.Close();
    WScript.Quit();
}

WScript.Echo("Error with argumnets.Please read README.md")