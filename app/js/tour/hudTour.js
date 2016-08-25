'use strict';

var {CENTER_URL, HUD_URL} = require('ozp-react-commons/OzoneConfig');
HUD_URL = `/${HUD_URL.match(/http.?:\/\/[^/]*\/(.*?)\/?$/)[1]}/`;

var PubSub = require('browser-pubsub');
var tourCh = new PubSub('tour');
var ObjectDB = require('object-db');
// rjk
var tourDB = new ObjectDB('ozp_tour').get();
var contentLocal = 'NO';
if(tourDB.library === true){
  contentLocal = "This simple tour guides you through the toolbar items and introduces you to the primary components of the system: The Center, HUD, and Webtop. These three components enable you to discover, bookmark, rate, review, organize and launch mission and business applications from across the enterprise.";
}

var ProfileSearchActions = require('../actions/ProfileSearchActions');
var readyObject = {};

// HACK: for some reason window.localstorage is lost in this file.
setInterval(() => {
  readyObject = Object.assign({}, readyObject, tourCh.get());
}, 100);

const meTour = new Tour({
  backdrop: true,
  backdropPadding: 10,
  storage: false,
  onEnd: function() {
    ProfileSearchActions.goHome();
  },
  template: '<div class="popover" role="tooltip" tabIndex="0"> <div class="arrow"></div> <h3 class="popover-title"></h3> <div class="popover-content"></div> <div class="popover-navigation" style="width:300px;"> <button class="btn btn-sm" id="end-tour-btn" data-role="end" tabIndex="0">End tour</button> <div class="btn-group"> <button class="btn btn-sm btn-default" data-role="prev" tabIndex="0">&laquo; Prev</button> <button class="btn btn-sm btn-default" data-role="next" tabIndex="0">Next &raquo;</button> <button class="btn btn-sm btn-default" data-role="pause-resume" data-pause-text="Pause" data-resume-text="Resume" tabIndex="0">Pause</button> </div> </div> </div>',
  steps: [
    //0
    {
      title: "Welcome. ",
      //content: "This simple tour guides you through the toolbar items and introduces you to the primary components of the system: The Center, HUD, and Webtop. These three components enable you to discover, bookmark, rate, review, organize and launch mission and business applications from across the enterprise.",
      content: contentLocal,
      orphan: true,
      onShown: function(){
        $('#welcome').focus();
      },
      template: '<div id="welcome" class="popover" role="tooltip" tabIndex="0" aria-labelledby="tourTitle" aria-describedby="tourContent"> <h1 class="popover-header">Welcome to <img src="./images/marketplace-logo.png" alt="AppsMall Marketplace"></h1><h3 id="tourTitle" class="popover-title popover-subtitle"></h3> <div id="tourContent" class="popover-content"></div> <div class="popover-navigation"> <button class="btn btn-sm" id="end-tour-btn" data-role="end" tabIndex="0">No thanks</button> <div class="btn-group"> <button class="btn btn-sm btn-default" data-role="next" tabIndex="0">Start the tour &raquo;</button></div> </div> </div>'
    },
    //1
    {
      element: "#tourstop-hud",
      title: "HUD",
      content: "Opens HUD (heads up display) where your bookmarks are stored. Think of HUD like the home screen on a smart phone.",
      placement: "bottom",
      backdropContainer: ".navbar-fixed-top",
      backdropPadding: 0,
      onShow: function(){
        if(tourDB.library===false){
          console.log('NO');
          console.log(CENTER_URL);
          document.location.href = CENTER_URL;
        }
      },
      onShown: function(){
        if(tourDB.center_ran===true){
            meTour.goTo(7);
        }
      }
    },
    //2
    {
      element: "#tourstop-center",
      title: "Center",
      content: "Opens Center where you can search for listings to bookmark to your HUD or open in Webtop.",
      placement: "bottom",
      backdropContainer: ".navbar-fixed-top",
      backdropPadding: 0
    },
    //3
    {
      element: "#tourstop-webtop",
      title: "Webtop",
      content: "Opens Webtop, your customizable workspace within the platform.",
      placement: "bottom",
      backdropContainer: ".navbar-fixed-top",
      backdropPadding: 0
    },
    //4
    {
      element: "#tourstop-notifications",
      title: "Notifications",
      content: "Receive AppsMall notifications here. If you have an unread notification, the icon will change to blue to alert you. Once you've read a notification, you can click the X to dismiss it. Otherwise, it will disappear from the list when it expires.",
      placement: "bottom",
      backdropContainer: ".navbar-fixed-top",
      backdropPadding: 0
    },
    //5
    {
      element: "#tourstop-help",
      title: "Help",
      content: "Access help videos and articles explaining how to use the platform.",
      placement: "bottom",
      backdropContainer: ".navbar-fixed-top",
      backdropPadding: 0
    },
    //6
    {
      element: "#tourstop-global-menu",
      title: "Global Menu",
      content: "The global menu provides a list of resources you can use to submit listings, manage your listings, view your profile, contact us, etc.",
      placement: "left",
      backdropContainer: ".navbar-fixed-top",
      backdropPadding: 0,
      onShown: function() {
        $("#tourstop-global-menu").addClass("open");
      },
      onHide: function() {
        $("#tourstop-global-menu").removeClass("open");
      }
    },
    //7
    {
      element: ".LibraryTile:first",
      title: "Bookmarks",
      content: "When you bookmark a listing in Center, it appears here in your HUD. Bookmarks provide easy access to listings. Use them to group and access your tools. Click a tile to quickly launch the bookmark.",
      placement: "bottom",
      orphan: true,
      //backdropContainer: ".LibraryTile",
      //backdropPadding: 0,
      onShown: function() {
        $(".LibraryTile:first").addClass("open");
      },
      onHide: function() {
        $(".LibraryTile:first").removeClass("open");
      }
    },
    //8
    {
      element: ".LibraryTile:first",
      title: "Remove a Bookmark",
      content: "Use the menu on each bookmark tile to remove or get help for that specific listing. Removing the bookmark does not delete the listing from the system - it only disappears from your HUD. To bookmark it again, find it in Center.",
      placement: "right",
      orphan: true,
      //backdropContainer: ".LibraryTile",
      //backdropPadding: 0,
      onShown: function() {
        $(".LibraryTile__actionMenu > input").prop("checked", true);
      },
      onHide: function() {
        $(".LibraryTile__actionMenu > input").prop("checked", false);
      }
    },
    //9
    {
      element: ".FolderTile:first",
      title: "Drag and Drop into Folders",
      content: "Click a bookmark tile and drag it over another bookmark tile to create a folder. To add bookmark to an existing folder, drag and drop it over the folder tile.",
      placement: "bottom",
      orphan: true,
      //backdropContainer: ".FolderTile",
      //backdropPadding: 0,
      onNext: function(){meTour.goTo(10);}
    },
    //10
    {
      path: `${HUD_URL}#/folder/New%20Folder`,
      element: "#rjk",
      title: "Folder",
      content: "Click a folder tile to access the contents. From this view you can access individual bookmarks and get a link to share the folder with others. To move bookmarks out of a folder, drag and drop the bookmark tile outside the window. The bookmark will return to the first level.",
      placement: "left",
      backdropContainer: ".FolderTile",
      backdropPadding: 0,
      orphan: true
    }
  ]
});

module.exports = meTour;