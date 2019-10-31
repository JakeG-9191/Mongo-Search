$.getJSON("/articles", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p class='scraped-art' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

$.getJSON("/saved", function (data) {
    for (var i = 0; i < data.length; i++) {
        $("#articles-saved").append("<p class='scraped-art' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

$(document).on("click", ".scraped-art", function () {
    $("#user-comment").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .then(function (data) {
            console.log(data);
            $("#user-comment").append("<h2>" + data.title + "</h2>");
            $("#user-comment").append("<input id='titleinput' name='title'>");
            $("#user-comment").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#user-comment").append("<button data-id='" + data._id + "'id='savecomment'>Save Your Comment</button>");
            $("#user-comment").append("<button data-id='" + data._id + "'id='save-art'>Save This Article</button>");
            $("#user-comment").append("<h2> Your Saved Comment <h2>")
            $("#user-comment").append("<input id='title2'></input>");
            $("#user-comment").append("<input id='comment2'></input>");
            $("#user-comment").append("<button data-id='" + data._id + "'id='deletecomment'>Delete Your Comment</button>");

            if (data.comment) {
                $("#title2").val(data.comment.title);
                $("#comment2").val(data.comment.body)
            }
        });
});

$(document).on("click", ".scraped-art", function () {
    $("#user-saved").empty();
    var thisId = $(this).attr("data-id");
    $.ajax({
            method: "GET",
            url: "/articles/" + thisId
        })
        .then(function (data) {
            console.log(data);
            $("#user-saved").append("<button data-id='" + data._id + "'id='delete-art'>Delete This Article From Saved</button>");
        });
});

function saveComment() {
    $(document).on("click", "#savecomment", function () {
        var thisId = $(this).attr("data-id");
        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    title: $("#titleinput").val(),
                    body: $("#bodyinput").val()
                }
            })
            .then(function (data) {
                console.log(data)
                $("user-comment").empty();
            });

        $("#titleinput").val("");
        $("#bodyinput").val("");
    });
}

function deleteComment() {
    $(document).on("click", "#deletecomment", function () {
        $("#title2").val("");
        $("#comment2").val("");
        var thisId = $(this).attr("data-id");

        $.ajax({
                method: "POST",
                url: "/articles/" + thisId,
                data: {
                    title: (""),
                    body: ("")
                }
            })
            .then(function (data) {
                console.log(data)
            });
    });
}

$(document).on("click", "#save-art", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "PUT",
        url: "/articles-saved/" + thisId,
    }).then(function(data) {
        console.log(data);
    });
});

$(document).on("click", "#delete-art", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "PUT",
        url: "/articles-deleted/" + thisId,
    }).then(function(data) {
        console.log(data);
    });
});

saveComment();
deleteComment();