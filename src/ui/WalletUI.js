//відповідає за роботу Renderer та ListenerManager

class WalletUI{

    constructor(app,listenerManager,renderer){
        this.app = app;
        this.listenerManager = listenerManager;
        this.renderer =renderer;

    }

    prepareUI(){
        this.getRenderer().renderUI();
        this.getListenerManager().setListeners()
    }
    
    getListenerManager(){
        return this.listenerManager;
    }

    getRenderer(){
        return this.renderer;
    }

}

module.exports = WalletUI;