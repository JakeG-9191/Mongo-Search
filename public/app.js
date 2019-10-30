$.getJSON("/articles", function(data){
    for (var i = 0; i < data.length; i++) {
        $("#articles").append("<p class='comment' data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</p>");
    }
});

$(".comment").on("click", function(){
    $("#user-comment").empty();
    var thisId = $(this).attr("data-id");

    $.ajax({
        method: "GET",
        url: "/articles/" + thisId
    })
    .then(function(data){
        console.log(data);
        $("#user-comment").append("<h3>" + data.title + "</h3>");
        $("#user-comment").append("<input id='titleinput' name='title'>");
        $("#user-comment").append("<textarea id='bodyinput' name='body'></textarea>");
        $("#user-comment").append("<button data-id='" + data._id + "'id='savecomment>Save Your Comment</button>");

        if(data.note){
            $("#comment-title").val(data.comment.title);
            $("#comment-body").val(data.comment.body)
        }
    });
});

$("#savecomment").on("click", function(){
    var thisId = $(this).attr("data-id");
    $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    })
    .then(function(data){
        console.log(data)
        $("user-comment").empty();
    });

    $("#titleinput").val("");
    $("#bodyinput").val();
});