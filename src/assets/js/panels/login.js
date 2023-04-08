/**
 * @author Luuxis
 * @license CC-BY-NC 4.0 - https://creativecommons.org/licenses/by-nc/4.0/
 */

'use strict';

import { database, changePanel, addAccount, accountSelect } from '../utils.js';
const { Mojang } = require('minecraft-java-core');
const { ipcRenderer } = require('electron');

class Login {
    static id = "login";
    async init(config) {
        this.config = config
        this.database = await new database().init();
        this.getOffline()
    }

    getOffline() {
        console.log(`Initializing microsoft Panel...`)
        console.log(`Initializing mojang Panel...`)
        console.log(`Initializing offline Panel...`)
        this.loginOffline();
    }

    async loginOffline() {
        let mailInput = document.querySelector('.Mail')
        let passwordInput = document.querySelector('.Password')
        let infoLogin = document.querySelector('.info-login')
        let loginBtn = document.querySelector(".login-btn")
        let mojangBtn = document.querySelector('.mojang')

        mojangBtn.innerHTML = "Offline"
        document.querySelector(".login-card").style.display = "none";
        document.querySelector(".login-card-mojang").style.display = "block";

        
        loginBtn.addEventListener("click", async () => {
            loginBtn.disabled = true;
            mailInput.disabled = true;
            infoLogin.innerHTML = "Connexion en cours...";

            if (mailInput.value.length < 3) {
                infoLogin.innerHTML = "Votre nom d'utilisateur doit avoir au moins 3 caractères"
                loginBtn.disabled = false;
                mailInput.disabled = false;
                passwordInput.disabled = false;
                return
            }

            

            let account_connect = await Mojang.login(mailInput.value, "");

            let account = {
                access_token: account_connect.access_token,
                client_token: account_connect.client_token,
                uuid: account_connect.uuid,
                name: account_connect.name,
                user_properties: account_connect.user_properties,
                meta: {
                    type: account_connect.meta.type,
                    offline: account_connect.meta.offline
                }
            }

            this.database.add(account, 'accounts')
            this.database.update({ uuid: "1234", selected: account.uuid }, 'accounts-selected');

            addAccount(account)
            accountSelect(account.uuid)
            changePanel("home");

            mailInput.value = "";
            loginBtn.disabled = false;
            mailInput.disabled = false;
            passwordInput.disabled = false;
            loginBtn.style.display = "block";
            infoLogin.innerHTML = "&nbsp;";
        })
    }
}

export default Login;