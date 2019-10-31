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
            $("#user-comment").append("<button type='button' class='btn btn-dark btn-lg' data-id='" + data._id + "'id='save-art'>Save This Article</button>");
            $("#user-comment").append("<a target='_blank' href='" + data.link + "'><button type='button' class='btn btn-dark btn-lg' id='visit-art'>Visit This Article</button></a>");

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
            $("#user-saved").append("<a target='_blank' href='" + data.link + "'><button type='button' class='btn btn-dark btn-lg' id='visit-art'>Visit This Article</button></a>");
            $("#user-saved").append("<button type='button' class='btn btn-dark btn-lg' data-id='" + data._id + "'id='delete-art'>Delete This Article From Saved</button>");
            $("#user-saved").append("<h2>" + data.title + "</h2>");
            $("#user-saved").append("<input id='titleinput' name='title'>Add Your Title Above and Comment Below</input>");
            $("#user-saved").append("<textarea id='bodyinput' name='body'></textarea>");
            $("#user-saved").append("<button type='button' class='btn btn-dark btn-lg' data-id='" + data._id + "'id='savecomment'>Save Your Comment</button>");
            $("#user-saved").append("<h2> Your Saved Comment <h2>")
            $("#user-saved").append("<input id='title2'></input>");
            $("#user-saved").append("<textarea id='comment2'></textarea>");
            $("#user-saved").append("<button type='button' class='btn btn-dark btn-lg' data-id='" + data._id + "'id='deletecomment'>Delete Your Comment</button>");
            if (data.comment) {
                $("#title2").val(data.comment.title);
                $("#comment2").val(data.comment.body)
            }
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
        location.reload();
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
    location.reload();
});

$(document).on("click", "#delete-art", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        type: "PUT",
        url: "/articles-deleted/" + thisId,
    }).then(function(data) {
        console.log(data);
    });
    location.reload();
});

saveComment();
deleteComment();