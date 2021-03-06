"use strict"
import * as vscode from 'vscode';
import { PreviewManager } from './PreviewManager'
import * as Constants from './Constants'

export default class Utilities {
    private static panel ;
    //returns true if an html document is open
    static checkDocumentIsHTML(showWarning: boolean): boolean {
        const languageId = vscode.window.activeTextEditor.document.languageId.toLowerCase()
        let result = (languageId === "html" || languageId === "xhtml")
        if (!result && showWarning) {
            vscode.window.showInformationMessage(Constants.ErrorMessages.NO_HTML);
        }
        return result;
    }

    static checkDocumentIs(languageId: string): boolean {
        return vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.languageId.toLowerCase() === languageId;
    }

    static init(viewColumn: number, context: vscode.ExtensionContext, previewUri: vscode.Uri) {
        let proceed = this.checkDocumentIsHTML(true);
        if (proceed) {
            if(!Utilities.panel) {                
                Utilities.panel = vscode.window.createWebviewPanel(
                    'quickHTMLPreview',
                    'Preview',
                    viewColumn,
                    { 
                        enableScripts: true
                    }
                );
                Utilities.panel.onDidDispose(()=>{
                    Utilities.panel = null;
                })
            }
            Utilities.refreshContent();
        }
    }

    static refreshContent() {
        Utilities.panel.webview.html = PreviewManager.htmlDocumentContentProvider.generateHTML()
    }
}
