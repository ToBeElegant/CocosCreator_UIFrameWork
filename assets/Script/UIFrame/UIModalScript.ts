import UIManager from "./UIManager";
import { ModalOpacity } from "./config/SysDefine";
import CocosHelper from "./CocosHelper";
import { UIWindow } from "./UIForm";
import WindowMgr from "./WindowMgr";

/**
 * @Author: 邓朗 
 * @Describe: modal
 * @Date: 2019-05-30 23:35:26  
 * @Last Modified time: 2019-05-30 23:35:26 
 */
const {ccclass, property} = cc._decorator;

@ccclass
export default class UIModalScript extends cc.Component {

    public fid: string;
    /** 代码创建一个单色texture */
    private _texture: cc.Texture2D = null;
    private getSingleTexture() {
        if(this._texture) return this._texture;
        let data: any = new Uint8Array(2 * 2 * 4);
        for(let i=0; i<2; i++) {
            for(let j=0; j<2; j++) {
                data[i*2*4 + j*4+0] = 255;
                data[i*2*4 + j*4+1] = 255;
                data[i*2*4 + j*4+2] = 255;
                data[i*2*4 + j*4+3] = 255;
            }
        }
        let texture = new cc.Texture2D();
        texture.name = 'single color'
        texture.initWithData(data, cc.Texture2D.PixelFormat.RGBA8888, 2, 2);
        texture.handleLoadedTexture();
        this._texture = texture;
        // texture.packable = true;
        texture.addRef();

        return this._texture;
    }

    /**
     * 初始化
     */
    public init() {
        let maskTexture = this.getSingleTexture();
        
        let size = cc.view.getVisibleSize();
        this.node.height = size.height;
        this.node.width = size.width;

        this.node.addComponent(cc.Button);
        this.node.on('click', this.clickMaskWindow, this);
        
        let sprite = this.node.addComponent(cc.Sprite)
        sprite.sizeMode = cc.Sprite.SizeMode.CUSTOM;
        sprite.type = cc.Sprite.Type.SIMPLE;
        sprite.spriteFrame = new cc.SpriteFrame(maskTexture);

        this.node.color = new cc.Color(0, 0, 0);
        this.node.opacity = 0;
        this.node.active = false;
    }

    // 
    public async showModal(lucenyType: number, time: number = 0.6, isEasing: boolean = true) {
        let o = 0;
        switch (lucenyType) {
            case ModalOpacity.None:    
                this.node.active = false;
            break;        
            case ModalOpacity.OpacityZero:   
                o = 0;
            break;
            case ModalOpacity.OpacityLow:    
                o = 63;
            break;
            case ModalOpacity.OpacityHalf:   
                o = 126;
            break;
            case ModalOpacity.OpacityHigh:
                o = 189;
            break;
            case ModalOpacity.OpacityFull:
                o = 255;
            break;
        }
        if(!this.node.active) return ;
        if(isEasing) {
            await CocosHelper.runTweenSync(this.node, cc.tween().to(time, {opacity: o}));
        }else {
            this.node.opacity = o;
        }
    }

    public async clickMaskWindow() {
        let com = UIManager.getInstance().getComponentByFid(this.fid) as UIWindow;
        if(com && com.modalType.clickMaskClose) {
            await WindowMgr.close(this.fid);
        }
    }
}