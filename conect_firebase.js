
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAhS7zhyXHLNGLpQ9saPZZg8Aol8jWaGPA",
    authDomain: "nutricao-em-um-olhar.firebaseapp.com",
    projectId: "nutricao-em-um-olhar",
    storageBucket: "nutricao-em-um-olhar.appspot.com",
    messagingSenderId: "101019466395",
    appId: "1:101019466395:web:d22a7fda84e635e544243e",
    measurementId: "G-MNX0D151MB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore(app);
// Signed in
const user_uid = localStorage.getItem('user');
console.log(user_uid);

const confirmar_elemente = document.getElementById('confirmar');
confirmar_elemente.addEventListener('click', confirmar);


// Recupera os dados do usuário
const docRef = doc(db, "user_info", user_uid);
getDoc(docRef)
    .then((docSnap) => {
        // Recupera os dados do documento (testes)
        if (docSnap.exists()) {
            if (docSnap.data()["initial"] == false) {
                let fieldIds = ["weight", "daily_calories", "carbs_percent", "lipids_percent", "protein_percent", "tolerance"];
                fieldIds.forEach(function (fieldId) {
                    // Define o valor do elemento como o valor no banco de dados
                    document.getElementById(fieldId).value = docSnap.data()[fieldId];
                });
            }
        } else {
            console.log("No such document!");
        }
    })
    .catch((error) => {
        console.error("Erro ao recuperar os dados:", error);
    });



function confirmar() {
    var fieldIds = ["weight", "daily_calories", "carbs_percent", "lipids_percent", "protein_percent", "tolerance"];
    var data = {};

    fieldIds.forEach(function (fieldId) {
        var value = parseInt(document.getElementById(fieldId).value);
        if (isNaN(value)) {
            var placeholder = document.getElementById(fieldId).placeholder;
            data[fieldId] = placeholder;
        } else {
            data[fieldId] = value;
        }
    });

    // Cria (ou atualiza) o documento para o usuário no Firestore (atual)
    setDoc(doc(db, "user_info", user_uid), {
        weight: data["weight"],
        daily_calories: data["daily_calories"],
        carbs_percent: data["carbs_percent"],
        lipids_percent: data["lipids_percent"],
        protein_percent: data["protein_percent"],
        tolerance: data["tolerance"],
        initial: 0
    })
        .then(() => {
            console.log("Documento atualizado com sucesso!");
        })
        .catch((error) => {
            // Ocorreu um erro ao gravar no Firestore
            console.error("Erro ao criar o documento: ", error);
        });

    // Cria (ou atualiza) o documento para o usuário no Firestore (histórico)
    setDoc(doc(db, user_uid, new Date().toISOString().slice(0, 10), "user_info", "info"), {
        weight: data["weight"],
        daily_calories: data["daily_calories"],
        carbs_percent: data["carbs_percent"],
        lipids_percent: data["lipids_percent"],
        protein_percent: data["protein_percent"],
        tolerance: data["tolerance"],
        initial: 0
    })
        .then(() => {
            console.log("Documento atualizado com sucesso!");
            // Operação de gravação concluída com sucesso
            // Troca para a página app.html
            // window.location.href = "app.html";


            // Muda para a página app.html
            // window.location.href = "app.html";

            /*
            // Recupera os dados do usuário
            const docRef = doc(db, "user", user_uid);
            
            getDoc(docRef)
                .then((docSnap) => {
                    
                    // Recupera os dados do documento (testes)
                    if (docSnap.exists()) {
                        console.log("Document data:", docSnap.data());
                    } else {
                        console.log("No such document!");
                    }
                    
                    // // Muda para a página app.html
                    // window.location.href = "app.html";
                })
                .catch((error) => {
                    console.error("Erro ao recuperar os dados:", error);
                });
            */
        })
        .catch((error) => {
            // Ocorreu um erro ao gravar no Firestore
            console.error("Erro ao criar o documento: ", error);
        });

}

// Botão de confirmar o prato
const confirmar_prato = document.getElementById('confirmar_prato');

// Adiciona um evento de clique ao botão
confirmar_prato.addEventListener('click', async function () {
    // Obtém a quantidade de alimentos no prato
    var qtd_alimentos = document.getElementsByClassName('filtro_textual').length;
    // console.log(qtd_alimentos);
    // Itera pelos alimentos
    for (var i = 1; i <= qtd_alimentos; i++) {
        // Obtém o nome do alimento
        console.log('filtro_textual_' + i);
        var nome_alimento = document.getElementById('filtro_textual_' + i).value;
        var quantidade_alimento = document.getElementById('slider_alimento_' + i).value;
        if (nome_alimento) {
            console.log(nome_alimento);
            // Salva o alimento no banco de dados
            // Imprime a hora do dia no formato HH:MM:SS
            var data = new Date();
            var hora = data.getHours();
            var minuto = data.getMinutes();
            var segundo = data.getSeconds();
            var hora_atual = hora + ":" + minuto + ":" + segundo;
            // Função assíncrona para recuperar o número de pratos do dia
            async function getNumberOfPlates() {
                var num_pratos = 0;
                var stop = false;

                while (!stop) {
                    console.log("Entrou no loop");

                    try {
                        var formated_date = data.toISOString().slice(0, 10);
                        var docRef = doc(db, user_uid, new Date().toISOString().slice(0, 10), "plates", "" + num_pratos, "food", "1");
                        var docSnap = await getDoc(docRef);

                        if (docSnap.exists()) {
                            num_pratos++;
                            console.log(num_pratos);
                        } else {
                            console.log("Parou o loop");
                            stop = true;
                        }
                    } catch (error) {
                        console.error("Erro ao recuperar os dados:", error);
                        stop = true;
                    }
                }

                console.log("Número de pratos: " + num_pratos);
                return num_pratos;
            }

            // Chama a função assíncrona para obter o número de pratos
            var num_pratos = await getNumberOfPlates();

            // getDoc(docRef)
            //     .then((docSnap) => {
            //         // Recupera os dados do documento (testes)
            //         if (docSnap.exists()) {
            //             num_pratos = docSnap.data().length;
            //             console.log(num_pratos);
            //         }
            //     })
            //     .catch((error) => {
            //         console.error("Erro ao recuperar os dados:", error);
            //     });
            // Cria (ou atualiza) o documento para o usuário no Firestore (atual)
            setDoc(doc(db, user_uid, new Date().toISOString().slice(0, 10), "plates", "" + num_pratos, "food", "" + i), {
                name: nome_alimento,
                quantity: quantidade_alimento
            })
                .then(() => {
                    console.log("Documento atualizado com sucesso!");
                }
                )
                .catch((error) => {
                    // Ocorreu um erro ao gravar no Firestore
                    console.error("Erro ao criar o documento: ", error);
                }
                );
        }
    }
});