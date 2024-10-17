import * as vscode from 'vscode';


function WorkWithFunctions(s:string){
	// fix name of function
	const sc: string[] = [];
	sc.push(s[0].toUpperCase());
	let i:number = 1;
	while(i<s.length){
		if (s[i] === '_'){
			sc.push((s[i+1].toUpperCase()).toString());
			i+=2;
		} else{
			sc.push(s[i]);
			i++;
		}
	}
	return sc.join("");
}

function WorkWithConsts(s:string){
	// fix name of constant
	return "k".concat(WorkWithFunctions(s));
}
function IsLetter(s:string){
	// returns if input can be a part of a function/variable name
	const symbs = "qwertyuiopasdfghjklzxcvbnmmQWERTYUIOASDFGHJKLZXCVBNM1234567890_:";
	if (symbs.includes(s)){
		return true;
	} else{
		return false;
	}
}

function IsLetterS(s:string){
	// returns if input can be a starting letter for a function/variable name
	const symbs = "qwertyuiopasdfghjklzxcvbnmmQWERTYUIOASDFGHJKLZXCVBNM";
	if (symbs.includes(s)){
		return true;
	} else{
		return false;
	}
}
function SplitMe(s:string){
	// detects single words - potentional functions and consts names
	// returns string[] - splitted input by the rule above
	let last:number =0;
	let splitted:string[] = [];
	let sc:string = "";
	let i:number = 0;
	let last_out :number = -1;
	while(i<s.length){
		if (IsLetterS(s[i]) && (!(i>0 && (IsLetter(s[i-1]))))){
			let t = i;
			while (t<s.length && IsLetter(s[t])){
				t++;
			}
			sc = sc.concat("№", s.substring(i, t), "№");
			i = t;
		} else{
			sc = sc.concat(s[i]);
			i++;
		}
	}
	splitted = sc.split("№");
	return splitted;
}

function FixConstants(text:string){
	// input -> text as a string
	// output -> text with consts' names fixed 
	// (fixes names only for consts declared in text)
	let result = "";
	const splitted = text.split("\n");
	let consts = new Set <string>;
	for(const line of splitted){
		if (line.length < 1){
			result = result.concat("\n");
			continue;
		}
		const words = SplitMe(line);
		let i: number = 0;
		while(i<words.length){
			if (words[i] === "const" && (i===1) && (!(words[i+3].includes("*")))){
				consts.add(words[i+4]);
				result = result.concat(words[i], " ",words[i+2], " ",  WorkWithConsts(words[i+4]));
				i+=5;
			} else{
				if (consts.has(words[i])){
					result = result.concat(WorkWithConsts(words[i]));
				} 
				else{
					result = result.concat(words[i]);
				}
				i++;
			}
		}
	}
	return result;
}


function FixFunctions(text:string){
	// input -> text as a string
	// output -> text with functions' names fixed 
	// (fixes names only for functions declared in text)
	let result = "";
	const splitted = text.split("\n");
	let consts = new Set <string>;
	for(const line of splitted){
		if (line.length < 1){
			result = result.concat("\n");
			continue;
		}
		const words = SplitMe(line);
		let i: number = 0;
		while(i<words.length){
			if (words[i].includes("_") && words[i+1] === '('){
				consts.add(words[i]);
				result = result.concat(WorkWithFunctions(words[i]));
				i++;
			} else{
				if (consts.has(words[i])){
					result = result.concat(WorkWithFunctions(words[i]));
				} 
				else{
					result = result.concat(words[i]);
				}
				i++;
			}
		}
	}
	return result;
}


export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('code-styler-for-google-rules.Style', () => {
		const editor = vscode.window.activeTextEditor;
        if (editor) {
            const document = editor.document;
            const selection = editor.selection;
            const text = selection.isEmpty ? document.getText() : document.getText(selection);
			// call all the fixes
			let result = (FixConstants(text));
			result = FixFunctions(result);
			// place heading on top of result
			result =  "// Your code was formated to follow the \"Google C++ Style Guide\" rules of naming functions and constants\n".concat(result);
            editor.edit(editBuilder => {
                if (selection.isEmpty) {
                    editBuilder.replace(new vscode.Range(0, 0, document.lineCount, 0), (result));
                } else {
                    editBuilder.replace(selection, result);
                }
            });
        }
		// give a feedback when everything is done
		vscode.window.showInformationMessage('Code formated');
	});

	context.subscriptions.push(disposable);
}

export function deactivate() {}
