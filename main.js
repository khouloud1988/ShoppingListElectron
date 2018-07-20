const electron = require('electron');
const url= require('url');
const path= require('path');

const {app, BrowserWindow, Menu,ipcMain} = electron;

//SET iNVIRONMENT PRODUCTION
process.env.NODE_ENV = 'production';

let mainWindow;
let addWindow;

//Listen for the app to be ready
app.on('ready',function(){
//create new window
mainWindow = new BrowserWindow({});
//Load html into window
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname,'mainWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    //Quit entire app if x is clicked
    mainWindow.on('closed',function(){
        app.quit();
    });
    //Build menu from template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert Menu
    Menu.setApplicationMenu(mainMenu);
});
//handle createAddWindow
function createAddWindow(){
    //create new window
addWindow = new BrowserWindow({
    width:300,
    height: 200,
    title: 'Add Shopping List Item'
});
//Load html into window
    addWindow.loadURL(url.format({
        pathname: path.join(__dirname,'addWindow.html'),
        protocol:'file:',
        slashes: true
    }));
    //Grabege collection handle
    addWindow.on('close',function(){
        addWindow = null;
    });

}

//catch item:add
ipcMain.on('item:add',function(e,item){
    mainWindow.webContents.send('item:add',item);
    addWindow.close();
});

//create menu template
const mainMenuTemplate= [
    {
        label: 'File',
        submenu:[
            {
                label:'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label:'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label:'Quit',
                accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
]

//if in mac
if(process.platform=='darwin'){
    mainMenuTemplate.unshift({});
}

//add developer tools if not in production
if(process.env.NODE_ENV !=='production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        accelerator: process.platform == 'darwin' ? 'Command+I': 'Ctrl+I',
        submenu:[
            {
                label: 'Toggle DevTools',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools();
                }
            },
            {
              role:'reload'  
            }
        ]
    });
}