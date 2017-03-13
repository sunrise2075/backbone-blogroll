/**
 * Created by sunrise2075 on 2017/3/13.
 */

//create model of Blog
var Blog = Backbone.Model.extend({
    defaults: {
        author: "",
        title: "",
        url: ""
    }
});

// define Backbone Collection
var Blogs = Backbone.Collection.extend({});

//instantiate two blogsView
var blog1 = new Blog({
    author: "Michael",
    title: "Michael's Blog",
    url: "http://michaelsblog.com"
});

var blog2 = new Blog({
    author: "John",
    title: "John's Blog",
    url: "http://johnsblog.com"
});

//instantiate blog collection
var blogs = new Blogs([blog1, blog2])

//define Backbone View for one single blog
var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: "tr",
    initialize: function(){
        var tpl = $(".blogs-list-template").html();
        this.template = _.template(tpl);
    },
    events: {
        "click .edit-blog": "edit",
        "click .update-blog": "update",
        "click .canel-update": "cancel",
        "click .delete-blog": "delete"
    },
    edit: function(){
        this.$(".edit-blog").hide();
        this.$(".delete-blog").hide();
        this.$(".update-blog").show();
        this.$(".canel-update").show();

        var author = this.$(".author").html();
        var title = this.$(".title").html();
        var url = this.$(".url").html();

        this.$(".author").html("<input type='text' class='form-control author-update' value='" +
            _.escape(author) + "'>");
        this.$(".title").html("<input type='text' class='form-control title-update' value='" +
            _.escape(title) + "'>");
        this.$(".url").html("<input type='text' class='form-control url-update' value='" +
            _.escape(url) + "'>");
    },

    update: function(){
        this.model.set("author" ,this.$(".author-update").val());
        this.model.set("title" ,this.$(".title-update").val());
        this.model.set("url" ,this.$(".url-update").val());
    },
    cancel: function(){
        blogsView.render();
    },
    delete: function(){
        this.model.destroy();
    },
    render: function(){
        var json = this.model.toJSON();
        var content = this.template({ model: json });
        this.$el.html(content);
        return this;
    }
});

//define Backbone View for the whole list of blog
var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $(".blogs-list"),
    initialize: function(){
        //register add event handler for this.model
        //at the event of adding blog to blog collection ,
        //run this.render function
        this.model.on("add", this.render, this);
        //register change event handler for this.model
        this.model.on("change", this.render, this);
        //register remove event handler for this.model
        this.model.on("remove", this.render, this);
    },
    render: function () {
        var self = this;
        this.$el.html("");
        _.each(this.model.toArray(), function(blog){
            var blogView = new BlogView({
                model: blog
            });
            var el = blogView.render();
            self.$el.append(el.$el);
        });
        return this;
    }
});

var blogsView = new BlogsView();
blogsView.render();

$(document).ready(function(){
    //add
    $(".add-blog").on("click", function(){
        var blog = new Blog({
            author: $(".author-input").val(),
            title: $(".title-input").val(),
            url: $(".url-input").val()
        });
        $(".author-input").val("");
        $(".title-input").val("");
        $(".url-input").val("");
        blogs.add(blog);
    });
});