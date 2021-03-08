const loginForm = document.querySelector(".form__container");
const signUpButton = document.querySelector(".singUp__button");
const signInButton = document.querySelector(".signIn__button");
const xButton = document.querySelector(".x__button");
const submitButton = document.querySelector(".send__button");
const signOutButton = document.querySelector(".signOut__button");
const articleContainer = document.querySelector(".messages__container");
const containerParagraph = document.querySelector(".container__praragraph");
const messageContainer = document.querySelector(".newMessage__container");
const newMessageInput = document.querySelector(".newMessage__input");
const buttonsContainer = document.querySelector(".buttons__container");
const articleDIV = document.createElement("div");

articleDIV.classList.add("article__container");

function show(element) {
  element.style.display = "block";
}

function hide(element) {
  element.style.display = "none";
}

signUpButton.addEventListener("click", () => {
  loginForm.id = "signUp";
  show(loginForm);
});

signInButton.addEventListener("click", () => {
  loginForm.id = "signIn";
  show(loginForm);
});
firebase.initializeApp(firebaseConfig);

let password = document.querySelector(".password");
let email = document.querySelector(".email");

function uppearLoginTop(email) {
  let tekst = email.value;
  loginTop.innerText = tekst;

  return buttonsContainer.appendChild(loginTop);
}

submitButton.addEventListener("click", (event) => {
  event.preventDefault();

  const user = {
    email: email.value,
    password: password.value,
  };
  addToLocalStorage("email", user.email);

  loginForm.id === "signIn" ? signIn(user) : signUp(user);

  password.value = "";
  email.value = "";
  hide(loginForm);
});

function addToLocalStorage(key, value) {
  localStorage.setItem(key, value);
}

let login = "";

function getFromLocalStorage() {
  login = localStorage.getItem("email");
}

function removeFromLocalStorage() {
  localStorage.removeItem("email");
}

const signUp = (element) => {
  firebase
    .auth()
    .createUserWithEmailAndPassword(element.email, element.password)
    .then((token) => {
      console.log(token);
      console.log(token.user.uid);
      signOut();
    })
    .catch((error) => {
      alert(error.message);
    });
};

const signOut = () => {
  firebase
    .auth()
    .signOut()
    .then(() => {
      console.log("User signet out!");
      removeFromLocalStorage();
    })
    .catch(() => {
      console.log("something went wrong");
    });
};

function signIn(token) {
  firebase
    .auth()
    .signInWithEmailAndPassword(token.email, token.password)
    .then(() => {
      hide(loginForm);
      getFromLocalStorage();
    })
    .catch((content) => {
      alert(content.message);
    });
}

signOutButton.addEventListener("click", () => {
  signOut();
});

function statusChange() {
  firebase.auth().onAuthStateChanged(function (token) {
    if (token !== null) {
      hide(signInButton);
      hide(signUpButton);
      hide(containerParagraph);
      show(signOutButton);
      show(articleDIV);

      messageContainer.style.display = "flex";
    } else {
      show(signInButton);
      show(signUpButton);
      show(containerParagraph);
      hide(signOutButton);
      hide(articleDIV);
      hide(messageContainer);
    }
  });
}
statusChange();

function forEachArticle() {
  firebase
    .firestore()
    .collection("articles")
    .orderBy("time", "desc")
    .onSnapshot((articles) => {
      articleDIV.innerHTML = "";
      console.log(articles);
      articles.forEach((article) => {
        createArticleContent(article);
      });
    });
}

forEachArticle();

function createArticleContent(article) {
  const newArticle = document.createElement("div");
  const articleFlex = document.createElement("div");
  const articleEmail = document.createElement("h3");
  const articleImage = document.createElement("img");
  const articleMessageContainer = document.createElement("div");
  const articleContent = document.createElement("p");
  const articleFooter = document.createElement("div");
  const articleLikeButton = document.createElement("img");
  const likeCounterArticle = document.createElement("p");
  const articleCommentButton = document.createElement("img");
  const commentCounter = document.createElement("p");
  const commentaryContainer = document.createElement("div");
  const commentaryEmail = document.createElement("p");

  const commentaryInput = document.createElement("input");
  const inputButton = document.createElement("button");
  // Główna część artykułu
  newArticle.classList.add("post__container");
  articleFlex.classList.add("article__flex");
  articleImage.classList.add("article__photo");
  articleMessageContainer.classList.add("message__container");
  articleEmail.classList.add("article__email");
  articleContent.classList.add("article__content");
  // Część z likeami i licznikami
  articleFooter.classList.add("articleFooter__container");
  articleLikeButton.classList.add("article__likeButton");
  likeCounterArticle.classList.add("like__counter");
  articleCommentButton.classList.add("article__messageButton");
  commentCounter.classList.add("comment__counter");
  // Część z komentarzami na artykuł
  commentaryContainer.classList.add("commentary__container");
  commentaryInput.classList.add("commentary__input");
  inputButton.classList.add("input__button");
  inputButton.innerText = "Comment";
  commentaryInput.setAttribute("placeholder", "write a comment");

  inputButton.innerText = "Comment";

  articleEmail.innerText = `${article.data().email} || ${article.data().time}`;
  articleContent.innerText = article.data().articleContent;
  articleLikeButton.setAttribute("src", "images/like.svg");
  likeCounterArticle.innerText = article.data().emailArray.length;
  articleCommentButton.setAttribute("src", "images/message.svg");
  commentCounter.innerText = article.data().commentaryContent.length;

  article.data().commentaryContent.forEach((comment) => {
    const commentContainer = document.createElement("div");
    commentContainer.classList.add("commentary__one");
    let html = "";
    // const email = localStorage.getItem("email");
    html += `<div class="comment__data">
      </div>
            <p class="comment">${comment}</p>`;

    commentContainer.innerHTML = html;
    commentaryContainer.appendChild(commentContainer);
  });
  commentaryContainer.style.display = "none";

  // Część z likeami i licznikami
  articleFooter.appendChild(articleLikeButton);
  articleFooter.appendChild(likeCounterArticle);
  articleFooter.appendChild(articleCommentButton);
  articleFooter.appendChild(commentCounter);
  // Część z komentarzami na artykuł
  commentaryContainer.appendChild(commentaryInput);
  commentaryContainer.appendChild(inputButton);
  commentaryContainer.appendChild(commentaryEmail);

  // Główna część artykułu
  articleFlex.appendChild(articleImage);
  articleFlex.appendChild(articleMessageContainer);

  articleMessageContainer.appendChild(articleEmail);
  articleMessageContainer.appendChild(articleContent);

  newArticle.appendChild(articleFlex);
  newArticle.appendChild(articleFooter);
  newArticle.appendChild(commentaryContainer);

  articleDIV.appendChild(newArticle);

  // listiners
  articleLikeButton.addEventListener("click", () => {
    addLike(article);
  });
  articleCommentButton.addEventListener("click", () => {
    hideCommentaryContainer(commentaryContainer);
  });
  inputButton.addEventListener("click", (e) => {
    // e.preventDefault;
    addComment(article, commentaryInput);
  });

  articleContainer.appendChild(articleDIV);
}

function setDate() {
  const now = new Date();
  console.log(now);
  return now.toUTCString();
}

function addingNewPost(event) {
  const email = localStorage.getItem("email");
  const articleContent = newMessageInput.value;
  const commentaryContent = [];
  const emailArray = [];

  const time = setDate();
  newMessageInput.value = "";

  const post = {
    email,
    articleContent,
    commentaryContent,
    emailArray,
    time,
  };

  addPostToDb(post);

  console.log(localStorage.getItem("date"));
}
function addPostToDb(post) {
  firebase.firestore().collection("articles").add(post);
}

const kraaButton = document.querySelector(".kraaak__button");
kraaButton.addEventListener("click", addingNewPost);

function hideCommentaryContainer(element) {
  if (element.style.display === "block") {
    hide(element);
  } else if (element.style.display === "none") {
    show(element);
  }
}

async function addComment(article, commentaryInput) {
  let newArray = [];
  await firebase
    .firestore()
    .collection("articles")
    .doc(article.id)
    .get()
    .then((article) => (newArray = article.data().commentaryContent));
  console.log(newArray);
  newArray.push(commentaryInput.value);
  firebase.firestore().collection("articles").doc(article.id).update({
    commentaryContent: newArray,
  });
  commentaryInput = "";
}

async function addLike(article) {
  let newArray = [];
  const email = localStorage.getItem("email");
  await firebase
    .firestore()
    .collection("articles")
    .doc(article.id)
    .get()
    .then((article) => (newArray = article.data().emailArray));

  if (newArray.includes(email)) {
  } else {
    newArray.push(email);
  }

  firebase.firestore().collection("articles").doc(article.id).update({
    emailArray: newArray,
  });
  const likeCounterLenght = newArray.length;
  firebase.firestore().collection("articles").doc(article.id).update({
    likeCounter: likeCounterLenght,
  });
}
