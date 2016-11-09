var newsEl = document.getElementById("news");
var newsTitleEl = document.getElementById("newsTitle");
var newsBodyEl = document.getElementById("newsBody");
var commentCnt;
var hnCommentsBaseURL = "https://news.ycombinator.com/item?id=";

window.onload = function () {
    newsEl = document.getElementById("news");
    newsTitleEl = document.getElementById("newsTitle");
    newsBodyEl = document.getElementById("newsBody");
    numOfStories = 5;
    loadTopStories();
}

function loadTopStories() {
    newsTitleEl.innerHTML = "Top Stories";

    var aClient = new HttpClient();
    var postIDs = [];
    aClient.get('https://hacker-news.firebaseio.com/v0/topstories.json', function (response) {
        var object = JSON.parse(response);
        var numOfStories = 5;
        for (i = 0; i < numOfStories; i++) {
            postIDs[i] = object[i];
        }
        loadStories(postIDs);
    })
}

function loadStories(data) {
    var aClient = new HttpClient();
    var url;
    var result;

    result = "<ul id=\"storyList\" class=\"list-group\">";
    result += "</ul>";
    newsBodyEl.innerHTML = result;


    for (i = 0; i < data.length; i++) {
        url = 'https://hacker-news.firebaseio.com/v0/item/' + data[i] + '.json';
        aClient.get(url, function (response) {
            var object = JSON.parse(response);
            var result = parseStory(object);
            var resultHTML = document.getElementById("storyList");

            resultHTML.innerHTML += result;
            console.log(object);
        })
    }
}

function parseStory(story) {
    var storyHTML;
    console.log("in parse story");

    commentCnt = 0;
    commentCnt = story.kids.length;
    //getCountOfComments(story.id);
    //getTotalPostComments(story.id);
    //testGetCount(story.id);

    storyHTML = "<li class=\"list-group-item\">";
    storyHTML += " <div class=\"row\">";
    storyHTML += "  <div class=\"col-md-1\">";
    storyHTML += "    <h3 class=\"score\">" + story.score + "</h3>";
    storyHTML += "  </div>";
    storyHTML += "  <div class=\"col-md-11\">";
    storyHTML += "     <a href=\"" + story.url + "\">" + story.title + "</a>"
    storyHTML += "     <br/>posted by " + story.by + " | Main Comments: " + commentCnt;
    storyHTML += "  </div>";
    storyHTML += " </div>";
    storyHTML += "</li>";
    return storyHTML;

}


function parseStories(data) {
    console.log("in parseStories");

    var object = JSON.parse(data);
    var result;

    result = "<ul class=\"list-group\">";

    var numOfStories = 2;

    for (i = 0; i < numOfStories; i++) {

        result += "<li class=\"list-group-item";

        if (object[i].name.includes("angular")) {
            console.log("found match");
            result += " list-group-item-success";
        }
        result += "\">";
        result += "<a href=\"" + object[i].html_url + "\"/>"
        result += i + 1 + ". " + object[i].name;
        result += "</a>";
        result += "</li>";
    }

    result += "</ul>";

    newsBodyEl.innerHTML = result;

}

var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}




function getCountOfComments(parentID) {

    var aClient = new HttpClient();
    url = 'https://hacker-news.firebaseio.com/v0/item/' + parentID + '.json';

    aClient.get(url, function (response) {
        var object = JSON.parse(response);
        if (object.hasOwnProperty('kids')) {
            if (object.kids.length > 0) {
                for (i = 1; i <= object.kids.length; i++) {
                    commentCnt += 1;
                    getCountOfComments(object.kids[i - 1]);
                }
            }
        }
    })
}



function getTotalPostComments(parentID) {
    var aHttpRequest = new XMLHttpRequest();
    url = 'https://hacker-news.firebaseio.com/v0/item/' + parentID + '.json';
    aHttpRequest.onreadystatechange = function () {
        if (aHttpRequest.readyState == 4 && aHttpRequest.status == 200) {
            var object = JSON.parse(aHttpRequest.responseText);
            if (object.hasOwnProperty('kids')) {
                if (object.kids.length > 0) {
                    for (i = 1; i <= object.kids.length; i++) {
                        if (object.type = "comment") {
                            commentCnt += 1;
                            getTotalPostComments(object.kids[i - 1]);
                        }
                    }
                }
            }
        }
    }
    aHttpRequest.open("GET", url, true);
    aHttpRequest.send(null);
}

function loadCommentCount() {
    newsBodyEl.innerHTML += "</br> Comments:" + commentCnt;
}

function testGetCount(parentID) {
    var object = JSON.parse(makeHTTPRequest(parentID));
    if (object.hasOwnProperty('kids')) {
        if (object.kids.length > 0) {
            for (i = 1; i <= object.kids.length; i++) {
                if (object.type = "comment") {
                    commentCnt += 1;
                    testGetCount(object.kids[i - 1]);
                }
            }
        }
    }
}

function makeHTTPRequest(parentID) {
    var aHttpRequest = new XMLHttpRequest();
    url = 'https://hacker-news.firebaseio.com/v0/item/' + parentID + '.json';
    aHttpRequest.open("GET", url, false);
    aHttpRequest.send(null);
    console.log(aHttpRequest.responseText);
    return aHttpRequest.responseText;
}