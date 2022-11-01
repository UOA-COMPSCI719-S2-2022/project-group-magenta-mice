
let post= document.querySelector("#post");
post.addEventListener("submit", function comments(){
    let commentBoxValue= document.querySelector("#comment-box").value;
 
    let li = document.createElement("li");
    let text = document.createTextNode(commentBoxValue);
    li.appendChild(text);
    document.querySelector("#unordered").appendChild(li);
 
});

