var kongregate = parent.kongregate;
var itemList = JSON.parse(localStorage.getItem('itemInfo')); //List of every item in the game
var skillList = JSON.parse(localStorage.getItem('skillInfo')); //List of every item in the game
var skillLevels = JSON.parse(localStorage.getItem('skillLevels')); //List of every item in the game
var map; //Map container Variable
var playerX; //Player X position from DB
var playerY; //Player Y position from DB
var savedX; //Player X new position
var savedY; //Player Y new position
const walk = 350; //Player walk speed
var sessionToken = ''; //Session token for AJAX calls
var active = false; //Variable showing if phaser map is active
var reload = false; //Reload flag for page refreshes
var validRefresh = true; //Flag for manual/auto refresh
var init_inventory; //Holds account inventory levels
var init_equips = [-1, -1, -1, -1]; //Holds 4 equipped items for battle
var init_eSkills; //Holds 4 equipped skills for battle
var init_locationCode; //Holds location code for map generation
var init_char; //holds char information for char page
var init_statusBar; //Holds information needed for top status bar
var init_enemyList = 0;
var init_equipment;
var init_equipmentJSON;
var init_equipped_equipmentJSON = {};
var init_skills;
var init_skillTree;
var inventoryJSON;
var filterStashVar = 0; //Holds the inventory page filter, assigned from .html
var equipFilter = 0;
var canvasX = 1500; //Canvas X size for map generation
var canvasY = 800; //Canvas Y size for map generation
var layers = []; //Holds a list of all layers on current map
var enable = true; //Is combat NOT enabled
var shopname; //Holds the name of the currently open shop
var game;
var descripInfo;
var debugReply;
var shopExit;
var shop;
var clickedSkillUp;
var achievementList;
var playerMap;
var divClone;
var capturedMouseX;
var capturedMouseY;
var mouseOverride = false //Overrides phaser so tooltip can be correct
var temp = 0 //Temp variable with assorted uses
var shadow;
var message;
var lockedTabs = 0;
var oldWalk = 0;
var oldChat = '';
var hitbox;
var dailyQuest = false;
var dailyComplete = false;
var rects = [];
var animatedTiles = [];
var animationFrame = 0;
var animationOn = 1;
var shadowAnimation = 0;
var shadowAnimationFrame = [];
var doodadsLayer;
var npcID;
var ret;
var rad = 10;
var lightClick = false;
var blendMode = 0;
var mouseDown = false;
var animationNumber = 4;
var debugCombat = false;
var filter = 0;
var combatLocked = false;
var mpxi = function(x) {
    return x
};
var questPanel = '<div class="wrapper scrollbar-inner" id="questWrapper"><div id="questLoading" style="width:132px; height:24px; display:none; position: absolute; top: 50%; left: 50%; margin-top: -12px; margin-left: -72px; background-image:url(../images/layout/loadingGray.png)"></div><div id="questInnerDiv"><div id="questText"></div><table style="width:100%; padding-top: 50px; font-size: 16px;"><tr><td style="width:50%; vertical-align:top;"><table style="width:100%"><tr><td colspan=2 style="text-align: center; font-size: 16px;"><strong>Task</strong></td></tr><tr id="req1row"><td style="width:50px"><div id="req1image" class="items"></div></td><td id="req1" style="font-size: 16px;"></td></tr><tr id="req2row"><td style="width:50px"><div id="req2image" class="items"></div></td><td id="req2" style="font-size: 16px;"></td></tr><tr id="req3row"><td style="width:50px"><div id="req3image" class="items"></div></td><td id="req3" style="font-size: 16px;"></td></tr></table></td><td style="width:50%;"><table style="width:100% vertical-align:top;"><tr><td colspan=2 style="text-align: center; font-size: 16px;"><strong>Rewards</strong></td></tr><tr id="rewardErow"><td style="width:50px"><div id="rewardEimage" class="items"></div></td><td id="rewardEXP" style="font-size: 16px;"></td></tr><tr id="rewardSrow"><td style="width:50px"><div id="rewardSimage" class="items"></div></td><td id="rewardSilver" style="font-size: 16px;"></td></tr><tr id="reward1row"><td style="width:50px"><div id="reward1image" class="items"></div></td><td id="reward1" style="font-size: 16px;"></td></tr><tr id="reward2row"><td style="width:50px"><div id="reward2image" class="items"></div></td><td id="reward2" style="font-size: 16px;"></td></tr><tr id="reward3row"><td style="width:50px"><div id="reward3image" class="items"></div></td><td id="reward3" style="font-size: 16px;"></td></tr></table></td><tr></table><div style="width:650px; height:4px; margin: 10px 40px; background-image:url(../images/layout/spanner.png)"></div><div style="display: flex; padding-right: 50px;"><div class="questTabs" style="background-image:url(../images/ui-buttons/quest_accept.png);" data-id="" id="questLeft">Accept</div><div style="background-image:url(../images/ui-buttons/quest_leave.png);   margin-left: -70px;" class="questTabs" id="questRight">Leave</div></div><div style="background-image:url(../images/ui-buttons/quest_leave.png);  display:none; margin:20px auto;" class="questTabs" id="questComplete">Leave</div></div></div>';
var fakeQuest = '["2","working","Well hello there!<br\/><br\/>Do you have time to help me out a bit with some farm work? I can pay you ofcorse!  Those damn rabbits keep eating all my crops, kill a bunch and bring me 4 hides and I can maybe make something for you!","Thanks so much for getting these for me!  Here is some goodies for your time, Come back soon and I may have more work for you!","","30","4","0","0","0","0","4","1","5","3","0","0","15","15"]';
//element exists override
window.onerror = function(errorMsg, url, lineNumber, column, errorObj) {
    var text = 'Error: ' + errorMsg + ' Script: ' + url + ' Line: ' + lineNumber +
        ' Column: ' + column + ' URL: ' + window.location.href + ' PATH: ' + window.location.pathname + ' StackTrace: ' + errorObj;

    console.log("Logging error..");
    $.ajax({
        type: "POST",
        dataType: "text",
        data: {
            call: "logError",
            text: text
        },
        url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
    });
}
$.fn.exists = function() {
    return this.length !== 0;
}

function formatNumber(x) {
    try {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch (err) {
        return 0;
    }
}
$(document).ready(function() {
    //  --------------------------------------------------------------------------------------------------
    //               Page init function holding action handlers and loadCookie() function call
    //  --------------------------------------------------------------------------------------------------
    // try {
    //     addItems();
    //     kongregate.mtx.addEventListener("adsUnavailable", function(obj) {
    //         $("#buffBtn").hide();
    //     });
    //     kongregate.mtx.addEventListener("adCompleted", function(obj) {
    //         $("#buffBtn").hide();
    //         ajaxCall("text", "kongBuff");
    //     });
    //     kongregate.mtx.initializeIncentivizedAds();
    // } catch (err) {console.log(err)}
    $('.tooltip').tooltipster();
    $(".fancybox").fancybox();
    jQuery('.scrollbar-inner').scrollbar();
    $(".fancyboxStore").fancybox({
        afterClose: addItems,
        onClosed: addItems
    });
    $(".fancyboxPack").fancybox({
        afterClose: addStarterPack,
        onClosed: addStarterPack
    });
    $(".fancyboxquest").fancybox({
        beforeShow: getDailyQuest,
        afterClose: sync_char
    });
    $(".fancyboxmap").fancybox({
        beforeShow: drawMinimap
    });
    if (navigator.userAgent.indexOf("Firefox") != -1) {
        $('div[id^="main-"]').css('height', '100%');
    }
    loadCookie();
    $(".bestFilters").change(function() {
        if (lockedTabs == 0) {
            lockedTabs = 1;
            tab = $(this).attr("id");
            if (tab == 'chapterFilter') {
                $('#zoneFilter :nth-child(1)').prop('selected', true);
                $('#mapFilter :nth-child(1)').prop('selected', true);
            } else if (tab == 'mapFilter') {
                $('#zoneFilter :nth-child(1)').prop('selected', true);
            }
            zoneOption = $('#zoneFilter').find(":selected").text();
            mapOption = $('#mapFilter').find(":selected").text();
            chapterOption = $('#chapterFilter').find(":selected").text();

            $('.bestiry').hide();
            $('.bestiry').each(function(index) {
                zone = $(this).attr("data-zone");
                maps = $(this).attr("data-map");
                chapter = $(this).attr("data-chapter");
                if ((zone == zoneOption || 'All Zones' == zoneOption) && (maps == mapOption || 'All Maps' == mapOption) && (chapter == chapterOption || 'All Chapters' == chapterOption)) {
                    $(this).show();
                }
            });


            $('#zoneFilter').html($('<option>', {
                value: "All Zones",
                text: "All Zones"
            }));
            $('#mapFilter').html($('<option>', {
                value: "All Maps",
                text: "All Maps"
            }));
            $('#chapterFilter').html($('<option>', {
                value: "All Chapters",
                text: "All Chapters"
            }));
            $('.bestiry:visible').each(function(index) {
                zone = $(this).attr("data-zone");
                maps = $(this).attr("data-map");
                chapter = $(this).attr("data-chapter");
                if ($("#zoneFilter option[value='" + zone + "']").length === 0 && zone != '') {
                    $('#zoneFilter').append($('<option>', {
                        value: zone,
                        text: zone
                    }));
                }
                if ($("#mapFilter option[value='" + maps + "']").length === 0 && maps != '') {
                    $('#mapFilter').append($('<option>', {
                        value: maps,
                        text: maps
                    }));
                }
                if ($("#chapterFilter option[value='" + chapter + "']").length === 0 && chapter != '') {
                    $('#chapterFilter').append($('<option>', {
                        value: chapter,
                        text: chapter
                    }));
                }
            });
            $("#chapterFilter option[value='" + chapterOption + "']").prop('selected', true);
            $("#mapFilter option[value='" + mapOption + "']").prop('selected', true);
            $("#zoneFilter option[value='" + zoneOption + "']").prop('selected', true);
            lockedTabs = 0;
            $('#mapBtn').addClass("selected");
        }
    });
    $('#buyStarterPack').click(function(){
        kongregate.mtx.purchaseItems([15], addStarterPack());
    });
    $('.craftingSelector').click(function() {
        var slot = $(this)
        itemPickerShow(function(ret) {
            try{
                slot.css("background-image", "url(../images/items/" + inventoryJSON[ret].image + ".png)")
                slot.attr("data-uid", ret);
                slot.attr("data-id", inventoryJSON[ret].itemID);
                slot.attr("data-equip", inventoryJSON[ret]["equipment"]);
                var complete = true;
                JObject = [];
                $('.craftingSelector').each(function(index) {
                    JObject.push($(this).attr("data-id"));
					JObject.push($(this).attr("data-equip"));
                    if($(this).attr("data-uid") == -1){
                        complete = false;
                    }
                });
                if(complete){
                    ajaxCall("json", "getRecipe", JSON.stringify(JObject));
                }
            }catch (err){
                slot.attr("data-uid", -1);
                slot.attr("data-id", -1);
                slot.attr("data-equip", 0);
            }
        })
    });

    $('.filters').click(function() {
        $('.filters').removeClass("filtersClicked");
        $(this).addClass("filtersClicked");
    });
    $('#craftNowBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            JObject = [];
            $('.craftingSelector').each(function(index) {
                JObject.push($(this).attr("data-id"));
                JObject.push($(this).attr("data-equip"));
                if($(this).attr("data-uid") == -1){
                    complete = false;
                }
            });
            ajaxCall("text", "craft", JSON.stringify(JObject));
        }
    });
    $('#attackButton').on("click", function() {
        if (!($(this).hasClass("disabledButton"))) {
            if ($(this).html() == 'Attack') {
                $('.combatButton').addClass("disabledButton");
                ajaxCall("JSON", "combatAction", "attack");
            } else if ($(this).html() == 'Collect Loot') {
                unloadCombat();
            } else {
                location.reload();
            }
        }
    });
    $('#runButton').on("click", function() {
        if (!($(this).hasClass("disabledButton"))) {
            $('.combatButton').addClass("disabledButton");
            ajaxCall("JSON", "combatAction", "run");
        }
    });
    $("div[ID^='combatItem']").on("click", function() {
        if (!($(this).hasClass("disabledButton"))) {
            $('.combatButton').addClass("disabledButton");
            ajaxCall("JSON", "combatAction", "item", $(this).data("id"));
        }
    });
    $("div[ID^='combatSkill']").on("click", function() {
        if (!($(this).hasClass("disabledButton"))) {
            $('.combatButton').addClass("disabledButton");
            ajaxCall("JSON", "combatAction", "skill", $(this).attr("data-id"));
        }
    });
    $(".statAdd").click(function() {
        if ($(this).hasClass("statAddEnabled")) {
            attr = ($(this).attr("data-attr"));
            $(".statAdd").removeClass("statAddEnabled");
            ajaxCall("text", "addStat", attr);
        }
    });
    $("#dailyAccept").click(function() {
        $.fancybox.close();
        ajaxCall("text", "startDailyQuest", dailyComplete);
    });
    $("#collapseComplete").click(function() {
        if ($(this).hasClass("clickedQuestFolder")) {
            $(this).removeClass("clickedQuestFolder");
            $("#completeQuests").slideUp();
        } else {
            $(this).addClass("clickedQuestFolder");
            $("#completeQuests").slideDown();
        }
    });
    $("#collapseIncomplete").click(function() {
        if ($(this).hasClass("clickedQuestFolder")) {
            $(this).removeClass("clickedQuestFolder");
            $("#incompleteQuests").slideUp();
        } else {
            $(this).addClass("clickedQuestFolder");
            $("#incompleteQuests").slideDown();
        }
    });
    $('#invBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            showDiv('main-invContainer');
            $(this).addClass("selected");
            descripInfo = "Your Inventory: A place where you can view all your things.";
            $("#divScript").html(descripInfo);
        }
    });
    $('#craftBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
			clearCrafting();
            showDiv('main-craftContainer');
            $(this).addClass("selected");
            descripInfo = "Combine three items for a chance to create a new, more useful item, or upgrade your equipment";
            $("#divScript").html(descripInfo);
        }
    });
    $('#wallBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            $('#wallWrapper').hide();
            $('#wallLoading').show();
            showDiv('main-wallContainer');
            $(this).addClass("selected");
            descripInfo = "Can you be the very best?  Better then all the rest?";
            $("#divScript").html(descripInfo);
            ajaxCall("text", "getWall");
        }
    });
    $('#fullBtn').click(function() {
        toggleFullScreen(document.body);
    });

    $('#achBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            $('#achWrapper').hide();
            $('#achLoading').show();
            showDiv('main-achievementContainer');
            $(this).addClass("selected");
            descripInfo = "Want something to achieve? here's some things to do!";
            $("#divScript").html(descripInfo);
            ajaxCall("text", "getAchievementProgress");
        }
    });
    $('#skillBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            showDiv('main-skillContainer');
            $(this).addClass("selected");
            descripInfo = "Your Skill Tree: Grow strong and learn young grasshopper.";
            $("#divScript").html(descripInfo);
        }
    });
    $('#mapBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            showDiv('main-mapContainer');
            $(this).addClass("selected");
        }
    });
    $('#charBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            showDiv('main-charContainer');
            $(this).addClass("selected");
        }
    });
    $('#questBtn, #questDetailsRight').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            $('#questLogWrapper').hide();
            $('#questLogLoading').show();
            ajaxCall("text", "getQuestLog");
            descripInfo = "What have you done? Who have you helped? Lets see...";
            $("#divScript").html(descripInfo);
            showDiv('main-questLogContainer');
            $(this).addClass("selected");
        }
    });
    $('#besBtn').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            showDiv('main-besContainer');
            $(this).addClass("selected");
            descripInfo = "This here is the beastiary where you'll find information on all the monsters you've encountered in your travels. <br><br> Mouse over an enemy for details.";
            $("#divScript").html(descripInfo);
        }
    });
    $('#suggestionButton').click(function() {
        $('#suggestionButton').prop('disabled', true);
        ajaxCall("text", "sendSuggestion", $('#suggestionInput').val());
        $('#suggestionInput').val("SUBMITTED!");
    });
    $('#closeShop, #leaveTeleport').click(function() {
        enableMenu();
        movePlayer();
    });
    $('#closeEquipmentShop').click(function() {
        enableMenu();
        movePlayer();
        $('#buyEquipList').html("");
        $('#equipTotal').html('0');
    });
    $('#closeStash').click(function() {
        enableMenu();
        movePlayer();
    });
    $('#clickBuy').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            $(this).addClass('clickedShop');
            $('#clickSell').removeClass('clickedShop');
            $('.sellTabs').hide();
            $('.buyTabs').show();
            $('#sellList').hide();
            $('#buyList').show();
        }
    });
    $('#clickSell').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            $(this).addClass('clickedShop');
            $('#clickBuy').removeClass('clickedShop');
            $('.sellTabs').show();
            $('.buyTabs').hide();
            $('#sellList').show();
            $('#buyList').hide();
            calcSaleTotal();
        }
    });
    $('#clickEquipBuy').click(function() {
        $(this).addClass('clickedShop');
        $('#clickEquipSell').removeClass('clickedShop');
        $('.sellTabs').hide();
        $('.buyTabs').show();
        $('#sellEquipList').hide();
        $('#buyEquipList').show();
    });
    $('#clickEquipSell').click(function() {
        $(this).addClass('clickedShop');
        $('#clickEquipBuy').removeClass('clickedShop');
        $('.sellTabs').show();
        $('.buyTabs').hide();
        $('#sellEquipList').show();
        $('#buyEquipList').hide();
        calcSaleTotal();
    });
    $("#sell").on("click", function() {
        var list = ''
        $('span[id^="itemSellCount_"]').each(function(index) {
            var id = $(this).attr('id').slice(14);
            var amnt = $(this).html();
            if (amnt > 0) {
                list = list + id + '|' + amnt + '-';
            }
        });
        if (list != '') {

            itemList = (list.substring(0, list.length - 1).split("-"));
            $(itemList).each(function(i,v){
                item = getInventoryJSONRecord(v.split("|")[0])
                updateInventoryJSON(item.itemID, "count", item.count - v.split("|")[1]);
            });
            populateInv();
            populateStash();
            $("#closeShop").addClass("disabledButton");
            $("#clickBuy").addClass("disabledButton");
            $("#clickSell").addClass("disabledButton");
            $("#buy").addClass("disabledButton");
            $("#sell").addClass("disabledButton");
            temp = 'sell';
            ajaxCall("text", "shopTransaction", list, 'sell');
        }
    });
    $('#buy').click(function() {
        var list = '';
        $('span[id^="itemBuyCount_"]').each(function(index) {
            var id = $(this).attr('id').slice(13);
            var amnt = $(this).html();
            if (amnt > 0) {
                list = list + id + '|' + amnt + '-';
            }
        });
        if (list != '') {
            itemList = (list.substring(0, list.length - 1).split("-"));
            $(itemList).each(function(i,v){
                item = getInventoryJSONRecord(v.split("|")[0])
                updateInventoryJSON(item.itemID, "count", +item.count + +v.split("|")[1]);
            });
            populateInv();
            populateStash();
            $("#closeShop").addClass("disabledButton");
            $("#clickBuy").addClass("disabledButton");
            $("#clickSell").addClass("disabledButton");
            $("#buy").addClass("disabledButton");
            $("#sell").addClass("disabledButton");
            ajaxCall("text", "shopTransaction", list, 'buy');
        }
    });
    $('#equipBuy').click(function() {
        if (!($(this).hasClass("disabledButton"))) {
            var list = '';
            $('div[id^="equipBuyImage"].clickedImage').each(function(index) {
                var id = $(this).attr('id').split('_')[1];
                list = list + id + '|';
            });
            if (list.length > 0) {
                $('.clickedImage').removeClass("clickedImage");
                $("#closeEquipmentShop").addClass("disabledButton");
                $("#clickEquipBuy").addClass("disabledButton");
                $("#clickEquipSell").addClass("disabledButton");
                $("#equipBuy").addClass("disabledButton");
                $("#equipSell").addClass("disabledButton");
                ajaxCall("text", "equipShopTransaction", list, 'buy');
            }
        }
    });
    $("#equipSell").on("click", function() {
        var list = '';
        $('div[id^="equipSellImage"].clickedImage2:visible').each(function(index) {
            var id = $(this).attr('id').split('_')[1];
            list = list + id + '|';
        });
        if (list != '') {
            ajaxCall("text", "equipShopTransaction", list, 'sell');
            $("#closeEquipmentShop").addClass("disabledButton");
            $("#clickEquipBuy").addClass("disabledButton");
            $("#clickEquipSell").addClass("disabledButton");
            $("#equipBuy").addClass("disabledButton");
            $("#equipSell").addClass("disabledButton");
            temp = 'sell';
        }
    });
    $("#resetBtn").on('click', function() {
        if (!($(this).hasClass("disabledButton"))) {
            if ($('#resetBtn').html() == '<strong>Ascend</strong>') {
                $('#resetBtn').html('<strong>YOU SURE?</strong>');
            } else if ($('#resetBtn').html() == '<strong>YOU SURE?</strong>') {
                $('#resetBtn').html('<strong>100%?</strong>');
            } else {
                ajaxCall("text", "softReset");
            }
        }
    });
    $('#equipSell').click(function() {
        var list = ''
        $('span[id^="itemSellCount_"]').each(function(index) {
            var id = $(this).attr('id').slice(14);
            var amnt = $(this).html();
            if (amnt > 0) {
                list = list + id + '|' + amnt + '-';
            }
        });
        if (list != '') {
            var counter = 0;
            list2 = list.split("-");
            while (counter != list2.length - 1) {
                initalAmt = init_inventory[(list2[counter].split('|')[0] - 1)].split('|')[1];
                sellAmt = list2[counter].split('|')[1];
                itemArrayIndex = (list2[counter].split('|')[0]) - 1;
                init_inventory[itemArrayIndex] = (itemArrayIndex + 1) + '|' + (initalAmt - sellAmt);
                counter++;
            }
            populateInv();
            populateStash();
            ajaxCall("text", "shopTransaction", list, 'sell');
        }
    });
    $(document.body).on('click', '.questDetailsButton', function() {
        $('#questDetailsLoading').show();
        $('#questDetailsWrapper').hide();
        showDiv('main-questDetailsContainer');
        ajaxCall("text", "getQuestLogDetail", $(this).attr("data-questid"), $(this).attr("data-complete"));
    });
    $("div[ID^='filter']").click(function() {
        $(this).toggleClass("clickedFilter");
        reFilterEquips();
    });
    $(document).on('click', "div[ID^='downArrow']", function(e) {
        var index = $(this).attr("data-index");
        var selected = $("#itemBuyCount_" + index).html();
        if (e.shiftKey) {
            for (i = 0; i < 24; i++) {
                if ($(this).hasClass("arrow")) {
                    selected = selected - 1;
                    $("#itemBuyCount_" + index).html(selected);
                }
                calcTotal();
            }
        }
        if ($(this).hasClass("arrow")) {
            selected = selected - 1;
            $("#itemBuyCount_" + index).html(selected);
        }
        calcTotal();
    });
    $(document).on('mouseleave', '.items, .skillContainer, .clickedSkill, .clickedSkill2, .skillTreeSkill, .equippableSkill, .multiUse, .multiUseItem, .noItems, .noSkills', function() {
        $("#divScript").html(descripInfo);
        $(this).removeClass("clickedImage");
        $(this).removeClass("clickedImage2");
        $(this).removeClass("clickedSkill");
        $(this).removeClass("clickedSkill2");
        $(this).removeClass("clickedMulti");
    });
    $(document).on('mouseenter', '.items, .skillContainer, .skillTreeSkill, .equippableSkill, .multiUseSkill, .multiUseItem', function() {
        try {
            if (undefined !== $(this).attr('data-script').length && $(this).attr('data-script').length) {
                if ($(this).attr('data-script').length > 0) {
                    document.getElementById("divScript").innerHTML = ($(this).attr('data-script'));
                }
            } else {
                $.ajax({
                    type: "POST",
                    dataType: "text",
                    data: {
                        call: "logError",
                        text: "String Missing: " + $(this).attr("id")
                    },
                    url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
                });
            }
        } catch (err) {

        }
    });
    $(document).on('mouseleave', '.equipmentShopItems, .skillTreeSkill, .buff, .multiUseSkill', function() {
        mouseOverride = false;
        $("#divScript").html(descripInfo);
    });
    $(document).on('mouseenter', '.equipmentShopItems, .skillTreeSkill, .buff', function() {
        mouseOverride = true;
        if ($(this).attr('data-script').length > 0) {
            document.getElementById("divScript").innerHTML = ($(this).attr('data-script'));
        }
    });
    $(document).on('mouseleave', '.bestiry, .achievement', function() {
        $("#divScript").html(descripInfo);
    });
    $(document).on('mouseenter', '.bestiry, .achievement', function() {
        if ($(this).attr('data-script').length > 0) {
            document.getElementById("divScript").innerHTML = ($(this).attr('data-script'));
        }
    });
    $(document).on('click', "div[ID^='upArrow']", function(e) {
        var index = $(this).attr("data-index");
        var selected = $("#itemBuyCount_" + index).html();
        if (e.shiftKey) {
            for (i = 0; i < 24; i++) {
                if (selected != '999' && $(this).hasClass("arrow")) {
                    selected = (parseInt(selected)) + 1;
                    $("#itemBuyCount_" + index).html(selected);
                }
                calcTotal();
            }

        }
        if (selected != '999' && $(this).hasClass("arrow")) {
            selected = (parseInt(selected)) + 1;
            $("#itemBuyCount_" + index).html(selected);
        }
        calcTotal();

    });
    $(document).on('click', "div[ID^='equipBuyImage']", function() {
        $(this).toggleClass("clickedImage");
        calcEquipTotal();
    });
    $(document).on('click', "div[ID^='equipSellImage']", function() {
        $(this).toggleClass("clickedImage2");
        calcEquipSaleTotal();
    });
    $(document).on('click', "div[ID^='sdownArrow']", function(e) {
        var index = $(this).attr("data-index");
        var selected = $("#itemSellCount_" + index).html();
        if (e.shiftKey) {
            for (i = 0; i < 24; i++) {
                if ($(this).hasClass("arrow")) {
                    selected = selected - 1;
                    $("#itemSellCount_" + index).html(selected);
                }
                calcSaleTotal();
            }
        }
        if ($(this).hasClass("arrow")) {
            selected = selected - 1;
            $("#itemSellCount_" + index).html(selected);
        }
        calcSaleTotal();
    });
    $(document).on('click', "div[ID^='supArrow']", function(e) {
        var index = $(this).attr("data-index");
        var selected = $("#itemSellCount_" + index).html();
        if (e.shiftKey) {
            for (i = 0; i < 24; i++) {
                if (selected != '99' && $(this).hasClass("arrow")) {
                    selected = (parseInt(selected)) + 1;
                    $("#itemSellCount_" + index).html(selected);
                }
                calcSaleTotal();
            }
        }
        if (selected != '99' && $(this).hasClass("arrow")) {
            selected = (parseInt(selected)) + 1;
            $("#itemSellCount_" + index).html(selected);
        }
        calcSaleTotal();
    })
    $(document).on('click', ".filterButtons", function() {
        $(this).toggleClass("upOne");
        reFilterEquips();
    })
    $(document).on('click', ".filterStashButtons", function() {
        $(this).toggleClass("upOne");
        reFilterStashEquips();
    })
    $(document).on('click', ".filterShopButtons", function() {
        $(this).toggleClass("upOne");
        reFilterShopEquips();
        calcEquipSaleTotal();
    })
    $(document).on('click', 'div[ID^="itemImage"]', function() {
        if (!$(this).hasClass("disabledButton")) {
            if ($(this).hasClass("clickedImage")) {
                if (filter == 1) {
                    item = getInventoryJSONRecord($(this).attr('data-id'));
                    if (init_equips.indexOf(item.itemID) == -1) {
                        init_equips[init_equips.indexOf("-1")] = item.itemID;
                        if (init_equips.indexOf(item.itemID) == -1) {
                            $('#invHeader').html('<span style="color:red;">You must remove something before equipping this!</span>');
                            $("#invHeader").show().delay(2000).fadeOut('slow');
                        } else {
                            $('#invHeader').html('<span style="color:green;">Item added to battle ready list!</span>');
                            $("#invHeader").show().delay(2000).fadeOut('slow');
                        }
                    } else {
                        $('#invHeader').html('<span style="color:red;">Item already equipped!</span>');
                        $("#invHeader").show().delay(2000).fadeOut('slow');
                    }
                    $(this).removeClass("clickedImage");
                    ajaxCall("text", "equipItem", item.itemID, "t");
                    populateEquip();
                }
            } else {
                if (filter < 2) {
                    $(this).addClass("clickedImage");
                }
            }
        }

    });
    $(document).on('click', '.multiUseItem', function() {
        if (!$(this).hasClass("disabledButton")) {
            if ($(this).hasClass("clickedMulti")) {
                useageAmnt = $(this).attr("data-use");
                item = getInventoryJSONRecord($(this).attr('data-itemid'))
                updateInventoryJSON(item.itemID, "count", item.count - useageAmnt);

                $("#usable-" + item.itemID).html(item.count);
                if ($("#usable-" + item.itemID).html() == '0') {
                    $("#usable-" + item.itemID).remove();
                }

                ajaxCall("JSON", "useItem", item.itemID, useageAmnt);
                $(this).removeClass("clickedMulti");
                $('div.items, div.multiUseItem').addClass("disabledButton");
            } else {
                $(this).addClass("clickedMulti");
            }
        }
    });

    $(document).on('click', 'div[ID^="equipped-"]', function() {
        if ($(this).hasClass("clickedImage2")) {
            equipID = $(this).attr("data-itemid");
            init_equipmentJSON[equipID]["equipped"] = 0;
            delete init_equipped_equipmentJSON[equipID]

            ajaxCall("text", "unequipEquipment", equipID);
            populateInv();
            populateStash();
            reFilterEquips();
            $(this).removeClass("clickedImage2");
        } else {
            $(this).addClass("clickedImage2");
        }
    });
    $(document).on('click', 'div[ID^="stashEquip-"]', function() {

        index = ($(this).attr("id")).split("-")[1];

        if(init_equipmentJSON[index].stored == 1){
            init_equipmentJSON[index].stored = 0;
        }else{
            init_equipmentJSON[index].stored = 1;
        }

        ajaxCall("text", "stashEquipment", index, init_equipmentJSON[index].stored);
        populateStash();
        populateInv();

        filterStash(filterStashVar);
    });
    $(document).on('click', 'div[ID^="stashItem-"]', function() {

        item = getInventoryJSONRecord(($(this).attr("id")).split("-")[1]);

        count = item.count;
        stored = item.stored;



        if ($(this).hasClass("stash")) {
            updateInventoryJSON(item.itemID, "stored", 0);
            updateInventoryJSON(item.itemID, "count", count + stored);
            ajaxCall("text", "unstashItem", item.itemID);
        } else {
            updateInventoryJSON(item.itemID, "count", 0);
            updateInventoryJSON(item.itemID, "stored", count + stored);
            ajaxCall("text", "stashItem", item.itemID);
        }

        populateStash();
        populateInv();
        filterStash(filterStashVar);

    });
    $(document).on('click', 'div[ID^="unequipped-"]', function() {
        equipID = $(this).attr("data-id");
        equipSlot = init_equipmentJSON[equipID]["slot"];
        if ($(this).hasClass("clickedImage")) {

            ajaxCall("text", "equipEquipment", equipID);

            counter = 0;
            $.each(init_equipped_equipmentJSON,function(i,v){
                if((equipSlot != "accessory" && v['slot'] == equipSlot)
                    || (equipSlot == '2hweapon' && v['slot'] == 'weapon')
                    || (equipSlot == '2hweapon' && v['slot'] == 'offhand')
                    || (equipSlot == 'weapon' && v['slot'] == '2hweapon')
                    || (equipSlot == 'offhand' && v['slot'] == '2hweapon')){
                    if(v['equipped'] == 1){
                        init_equipmentJSON[i]['equipped'] = 0;
                        delete init_equipped_equipmentJSON[i]
                    }
                }else if (equipSlot == "accessory" && v['slot'] == equipSlot){
                    counter++;
                    if(counter == 2){
                        init_equipmentJSON[i]['equipped'] = 0;
                        delete init_equipped_equipmentJSON[i]
                    }
                }
            });

            init_equipmentJSON[equipID]["equipped"] = 1;
            init_equipped_equipmentJSON[equipID] = init_equipmentJSON[equipID];

            populateInv();
            populateStash();
            reFilterEquips();
            $(this).removeClass("clickedImage");
        } else {
            $(this).addClass("clickedImage");
        }
    });
    $(document).on('click', '#main-invContainer div[ID^="equippedImage"]', function() {
        if ($(this).hasClass("clickedImage2")) {
            init_equips[$(this).attr('id').split('e')[3] - 1] = "-1";
            ajaxCall("text", "equipItem", $(this).attr('id').split('e')[3], "f");
            $('#invHeader').html('<span style="color:green;">Item removed from battle ready list!</span>');
            $("#invHeader").show().delay(2000).fadeOut('slow');
            populateEquip();
        } else {
            if ($(this).hasClass('items')) {
                $(this).addClass("clickedImage2");
            }
        }
    });
    $(document).on('click', '#main-charContainer div[ID^="equippedImage"]', function() {
        if ($(this).hasClass("clickedImage")) {
            showDiv('main-invContainer');
            descripInfo = "Your Inventory: A place where you can view all your things.";
            $("#divScript").html(descripInfo);
            $("#stashTab-0").trigger("click");
            $('#invBtn').addClass("selected");
            $("#invTab-1").trigger("click");
        } else {
            $(this).addClass("clickedImage");
        }
    });
    $(document).on('click', '#main-charContainer div[ID^="equippedSkillImage"]', function() {
        if ($(this).hasClass("noSkills")) {
            if ($(this).hasClass("clickedImage")) {
                showDiv('main-skillContainer');
                descripInfo = "Your Skill Tree: Grow strong and learn young grasshopper.";
                $("#divScript").html(descripInfo);
                $("#equipSkills").trigger("click");
                $('#skillBtn').addClass("selected");
            } else {
                $(this).addClass("clickedImage");
            }
        }else{
            if ($(this).hasClass("clickedSkill")) {
                showDiv('main-skillContainer');
                descripInfo = "Your Skill Tree: Grow strong and learn young grasshopper.";
                $("#divScript").html(descripInfo);
                $("#equipSkills").trigger("click");
                $('#skillBtn').addClass("selected");
            } else {
                $(this).addClass("clickedSkill");
            }
        }
    });
    $(".buyHealth, .buyMana").click(function() {
        if (!($(this).css("opacity") == .5)) {
            $('.tabs, .questTabs').addClass("disabledButton");
            ajaxCall("text", "restore", $(this).attr("id"));
        }
    });
    $(document).on('click', ".skillTreeSkill", function() {
        if (parseInt(init_char[27]) > 0 && $("#freeSkillPoints").html() != "0") {
            if ($(this).hasClass("openSkill") || $(this).hasClass("unlockedSkill")) {
                id = $(this).attr("data-skillID");
                clickedSkillUp = id;
                current = parseInt($("#skillLevel-" + id).attr("data-current"))
                allocated = parseInt($("#skillLevel-" + id).attr("data-allocated"))
                max = parseInt($("#skillLevel-" + id).attr("data-max"))
                if (current + allocated != max) {
                    $("#skillLevel-" + id).attr("data-allocated", allocated + 1);
                    $('#freeSkillPoints').html($('#freeSkillPoints').html() - 1);
                    shiftSkillLevelImages();
                }
            }
        }
    });

    $(document).on('click', ".multiUseSkill", function() {
        if (!$(this).hasClass("disabledButton")) {
            if ($(this).hasClass("clickedMulti")) {
                skillID = $(this).attr("data-skillID")
                $(".multiUse").addClass("disabledButton")
                ajaxCall("text", "useSkill", skillID, $(this).attr("data-use"));
                $(this).removeClass("clickedMulti");
            } else {
                $(this).addClass("clickedMulti");
            }
        }
    });

    $(document).on('click', ".equippableSkill", function() {
        if (true) {
            if ($(this).hasClass("clickedSkill")) {
                skillID = $(this).attr("data-skillID")
                if (init_eSkills.indexOf(skillID) == -1) {
                    init_eSkills[init_eSkills.indexOf("-1")] = skillID;
                    if (init_eSkills.indexOf(skillID) == -1) {
                        $("#skillEquipMessage").html('<span style="color:red;">You must remove something before equipping this skill!</span>');
                    } else {
                        $("#skillEquipMessage").html('<span style="color:green;">Skill added to battle ready list!</span>');
                    }
                } else {
                    $("#skillEquipMessage").html('<span style="color:red;">Skill already equipped!</span>');
                }
                $("#skillEquipMessage").show().delay(2000).fadeOut('slow');
                $(this).removeClass("clickedSkill");
                ajaxCall("text", "equipSkill", skillID, "t");
                populateEquippedSkills();
            } else {
                $(this).addClass("clickedSkill");
            }
        }
    });

    $("#skillResetButton").click(function() {
        $('.skillTreePoints').each(function(index) {
            $(this).attr("data-allocated", 0);
        });
        generateSkillTree();
        $('#freeSkillPoints').html(init_char[27]);
    });
    $("#skillConfirmButton").click(function() {
        skillAllocation = '';
        $('.skillTreePoints').each(function(index) {
            if ($(this).attr("data-allocated") > 0) {
                skillAllocation += $(this).attr("id").split("-")[1] + "|" + $(this).attr("data-allocated") + "-"
            }
        });
        ajaxCall("text", "allocateSkills", skillAllocation);
    });
    $(".filters").on("click", function() {
        $(".skillHidable").hide();
        $('#freeSkillPoints').html(init_char[27]);
        generateSkillTree()
        $("." + $(this).attr("data-show")).show();
        if ($(this).attr("data-show") != "assignGroup") {
            $(".unlockedSkill").addClass("forceCursor");
        } else {
            $(".unlockedSkill").removeClass("forceCursor");
        }
    });
    $(document).on('click', '#main-skillContainer div[ID^="equippedSkillImage"]', function() {
        if ($(this).hasClass("clickedSkill2")) {
            init_eSkills[$(this).attr('id').split('e')[3] - 1] = "-1";
            ajaxCall("text", "equipSkill", $(this).attr('id').split('e')[3], "f");
            $("#skillEquipMessage").html('<span style="color:green;">Skill removed from battle ready list!</span>');
            $("#skillEquipMessage").show().delay(2000).fadeOut('slow');
            populateEquippedSkills();
        } else {
            if ($(this).hasClass('items')) {
                $(this).addClass("clickedSkill2");
            }
        }
    });
    $(document).on('click', '.teleButton', function() {
        if (!$(this).hasClass("disabledButton")) {
            ajaxCall("text", "teleport", $(this).attr('data-waypointID'));
        }
    });
    $(document).on('click', '.towerTeleButton', function() {
        if (!$(this).hasClass("disabledButton")) {
            ajaxCall("text", "towerTeleport", $(this).attr('data-floorID'));
        }
    });
    $(document).on('mousemove', "#gameCanvas", function(event) {
        capturedMouseX = event.pageX - $(this).offset().left;
        capturedMouseY = event.pageY - $(this).offset().top;
    });
    $(document).on('mousedown', "#gameCanvas", function(event) {
        mouseDown = true;
    });
    $(document).mouseup(function(){
        mouseDown = false;
    });
    $(document).on('click', '#setRespawn', function() {
        if (!($(this).hasClass("savedSpawn"))) {
            ajaxCall("text", "setSpawn");
        }
    });

    $(document).keypress(function(evt) {
        keycode = (evt.charCode) ? evt.which : evt.keyCode
        if ($('#main-combatContainer').is(':visible')) {
            switch (keycode) {
                case 49:
                    $("#combatItem-1").trigger( "click" );
                    break;
                case 50:
                    $("#combatItem-2").trigger( "click" );
                    break;
                case 51:
                    $("#combatItem-3").trigger( "click" );
                    break;
                case 52:
                    $("#combatItem-4").trigger( "click" );
                    break;
                case 113:
                    $("#combatSkill-1").trigger( "click" );
                    break;
                case 119:
                    $("#combatSkill-2").trigger( "click" );
                    break;
                case 101:
                    $("#combatSkill-3").trigger( "click" );
                    break;
                case 114:
                    $("#combatSkill-4").trigger( "click" );
                    break;
                case 13:
                    $("#attackButton").trigger( "click" );
                    break;
            }
        }
    });
});

function saveCookie() {
    //  --------------------------------------------------------------------------------------------------
    //                 Stores the session token to local storage before page refresh
    //  --------------------------------------------------------------------------------------------------
    if (validRefresh == true) {
        localStorage.setItem("cookie", sessionToken);
    }
}

function loadCookie() {
    //  --------------------------------------------------------------------------------------------------
    //                 First call on load, loads cookie, and pushes an AJAX call
    //				   to grab key information from the server, then initializes the
    //				   game by calling checkCombat to see if in combat.
    //  --------------------------------------------------------------------------------------------------
    disableMenu();
    sessionToken = localStorage.cookie;
    localStorage.removeItem("cookie");
    if (sessionToken !== undefined) {
        $.when(init_ajaxCall("getEquippedItems"),
            init_ajaxCall("getInventoryJSON"),
            init_ajaxCall("getLocation"),
            init_ajaxCall("getStatus"),
            init_ajaxCall("getChar"),
            init_ajaxCall("getEnemyList"),
            init_ajaxCall("getEquipment"),
            init_ajaxCall("getEquippedSkills"),
            init_ajaxCall("getSkillLevels"),
            init_ajaxCall("getAchievements"),
            init_ajaxCall("getShadow"),
            init_ajaxCall("getSkillTree"),
            init_ajaxCall("getClass")
        ).done(function(a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11, a12, a13) {
            if (a1[0] == "error! Invalid Session") {
                window.location.replace('kong_splash_v2.html');
            } else {
                ajaxCall("text", "charExist");
                init_equips = JSON.parse(a1[0]);
                if (!init_equips || init_equips.length === 0) {
                    init_equips = [-1, -1, -1, -1];
                }
                init_eSkills = JSON.parse(a8[0]);
                inventoryJSON = JSON.parse(a2[0]);;
                init_locationCode = a3[0];;
                init_statusBar = JSON.parse(a4[0]);
                init_char = JSON.parse(a5[0]);
                init_equipment = JSON.parse(a7[0]);
                init_equipmentJSON = setInitEquipmentJSON(JSON.parse(a7[0]));
                init_enemyList = JSON.parse(a6[0]);
                init_skills = JSON.parse(a9[0]);
                achievementList = JSON.parse(a10[0]);
                shadow = JSON.parse(a11[0]);
                init_skillTree = a12[0];
                populateBestiry();
                populateCharPanel();
                populateStatus();
                populateInv();
                populateStash();
                generateSkillTree();
                buildAchievementPage();
                init_class = a13[0];
                $('.portrit').css('background-image', 'url(../images/portrits/' + init_class + '.png)');
                $('.combatPlayerContainer').css('background-image', 'url(../images/portrits/' + init_class + '.png)');
                ajaxCall("json", "checkCombat");
                addItems();
            }

        });
    } else {
        locationStore('error! Invalid Session');
    }


}

function init_ajaxCall(call) {
    //  --------------------------------------------------------------------------------------------------
    //                 AJAX container responsible for handling all the game init calls
    //  --------------------------------------------------------------------------------------------------
    return $.ajax({
        type: "POST",
        dataType: "text",
        data: {
            call: call,
            token: sessionToken
        },
        url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
    });
}

function sync_char() {
    $.when(init_ajaxCall("getEquippedItems"),
        init_ajaxCall("getInventoryJSON"),
        init_ajaxCall("getStatus"),
        init_ajaxCall("getChar"),
        init_ajaxCall("getEnemyList"),
        init_ajaxCall("getEquipment"),
        init_ajaxCall("getEquippedSkills"),
        init_ajaxCall("getSkillLevels"),
        init_ajaxCall("getAchievements"),
        init_ajaxCall("getSkillTree")
    ).done(function(a1, a2, a4, a5, a6, a7, a8, a9, a10, a12) {

        init_equips = JSON.parse(a1[0]);
        if (!init_equips || init_equips.length === 0) {
            init_equips = [-1, -1, -1, -1];
        }
        init_eSkills = JSON.parse(a8[0]);
        inventoryJSON = JSON.parse(a2[0]);
        init_statusBar = JSON.parse(a4[0]);
        init_char = JSON.parse(a5[0]);
        init_equipment = JSON.parse(a7[0]);
        init_equipmentJSON = setInitEquipmentJSON(JSON.parse(a7[0]));
        init_enemyList = JSON.parse(a6[0]);
        init_skills = JSON.parse(a9[0]);
        achievementList = JSON.parse(a10[0]);
        init_skillTree = a12[0];
        populateBestiry();
        populateCharPanel();
        populateStatus();
        populateInv();
        populateStash();
        generateSkillTree();
        buildAchievementPage();
    });
}

//###########################################################################################################################


//                          .oooooo.          .o.       ooo        ooooo oooooooooooo
//                          d8P'  `Y8b        .888.      `88.       .888' `888'     `8
//                          888               .8"888.      888b     d'888   888
//                          888              .8' `888.     8 Y88. .P  888   888oooo8
//                          888     ooooo   .88ooo8888.    8  `888'   888   888    "
//                          `88.    .88'   .8'     `888.   8    Y     888   888       o
//                          `Y8bood8P'   o88o     o8888o o8o        o888o o888ooooood8


//###########################################################################################################################

function initGame() {
    //  --------------------------------------------------------------------------------------------------
    //                 Initializes the phaser aspect of the game, does other magic too
    //  --------------------------------------------------------------------------------------------------
    var ping = 0;
    $('#loadingDiv').hide();
    var tileObjects;
    var main_state;
    if (init_locationCode.length > 60 || init_locationCode.split('-')[2] == "") {
        locationStore('error! Invalid Session');
    }
    var loc = init_locationCode.split('-');
    playerMap = (loc[2])
    playerX = parseInt(loc[0]);
    playerY = parseInt(loc[1]);
    $('#mapBtn').addClass("selected");

    if (window.frameElement) {
        canvasX = 868;
        canvasY = 612;
        $('#wrapper').css("height", canvasY + "px");
        $('#wrapper').css("width", canvasX + "px");
    } else {
        canvasX = $('#mainContainer').css('width').substring(0, $('#mainContainer').css('width').length - 2);
        canvasY = $('#mainContainer').css('height').substring(0, $('#mainContainer').css('height').length - 2);
        if (canvasX > 900) {
            canvasX = 900;
        }
        if (canvasY > 800) {
            canvasY = 800;
        }
        $('#wrapper').css("height", canvasY + "px");
        $('#wrapper').css("width", canvasX + "px");
        // $('#wrapper').css("margin-top", "-" + canvasY / 2 + "px");
        // $('#wrapper').css("margin-left", "-" + canvasX / 2 + "px");
    }


    game = new Phaser.Game(+canvasX + 150, (+canvasY + 50), Phaser.CANVAS, 'wrapper');
    enableMenu();
    main_state = {
        preload: function() {
            game.time.advancedTiming = true;
            if(playerMap == 'endless.php?'){
                playerMapPull = 'endless.php?token=' + sessionToken + '&';
            }else{
                playerMapPull = playerMap;
            }
            map = game.load.tilemap('tilemap', '../JSON/' + playerMapPull + '.json', null, Phaser.Tilemap.TILED_JSON);
            game.load.spritesheet('walker', '../images/map-sheets/' + loc[3] + '.png', 60, 60);
            game.load.image('rocks', '../images/map-sheets/rocks.png');
            game.load.image('trees', '../images/map-sheets/trees.png');
            game.load.image('water', '../images/map-sheets/water.png');
            game.load.image('cave', '../images/map-sheets/cave.png');
            game.load.image('npcs', '../images/map-sheets/npcs.png');
            game.load.image('grass', '../images/map-sheets/grass.png');
            game.load.image('graveyard', '../images/map-sheets/graveyard.png');
            game.load.image('farmland', '../images/map-sheets/farmland.png');
            game.load.image('muddyFarmland', '../images/map-sheets/muddyFarmland.png');
            game.load.image('transition', '../images/map-sheets/transition.png');
            game.load.image('mine', '../images/map-sheets/mine.png');
            game.load.image('caveNew', '../images/map-sheets/caveNew.png');
            game.load.image('desertOasis', '../images/map-sheets/desertOasis.png');
            game.load.image('desertSand', '../images/map-sheets/desertSand.png');
            game.load.image('desertTown', '../images/map-sheets/desertTown.png');
            game.load.image('desertWalls', '../images/map-sheets/desertWalls.png');
            game.load.image('desertRoofs', '../images/map-sheets/desertRoofs.png');
            game.load.image('adobe', '../images/map-sheets/adobe.png');
            game.load.image('sandyCave', '../images/map-sheets/sandyCave.png');
        },
        create: function() {
            game.input.mspointer.stop()
            hitbox = new Phaser.Rectangle();
            $('#loadingGray').hide();
            game.physics.startSystem(Phaser.Physics.P2JS);
            map = game.add.tilemap('tilemap');
            var WCG = game.physics.p2.createCollisionGroup();
            var PCG = game.physics.p2.createCollisionGroup();


            if (map.objects.Walls) {
                game.physics.p2.setImpactEvents(true);
                var walls = game.physics.p2.convertCollisionObjects(map, "Walls", true);
                for (var wall in walls) {
                    walls[wall].setCollisionGroup(WCG);
                    walls[wall].collides(PCG);
                }
            }

            game.stage.backgroundColor = '#787878';

            map.addTilesetImage('cave', 'cave');
            map.addTilesetImage('npcs', 'npcs');
            map.addTilesetImage('rocks', 'rocks');
            map.addTilesetImage('water', 'water');
            map.addTilesetImage('grass', 'grass');
            map.addTilesetImage('trees', 'trees');
            map.addTilesetImage('farmland', 'farmland');
            map.addTilesetImage('muddyFarmland', 'muddyFarmland');
            map.addTilesetImage('graveyard', 'graveyard');
            map.addTilesetImage('transition', 'transition');
            map.addTilesetImage('mine', 'mine');
            map.addTilesetImage('caveNew', 'caveNew');
            map.addTilesetImage('desertOasis', 'desertOasis');
            map.addTilesetImage('desertSand', 'desertSand');
            map.addTilesetImage('desertTown', 'desertTown');
            map.addTilesetImage('desertWalls', 'desertWalls');
            map.addTilesetImage('desertRoofs', 'desertRoofs');
            map.addTilesetImage('adobe', 'adobe');
            map.addTilesetImage('sandyCave', 'sandyCave');
            game.canvas.id = 'gameCanvas';
            map.layers.forEach(function(entry) {
                layers.push(map.createLayer(entry.name));
            });
            map.objects.Shapes.forEach(function(shape) {
                if (shape.rectangle) {
                    r1 = new Phaser.Rectangle(shape.x, shape.y, shape.width, shape.height);
                    r1.properties = shape.properties;
                    game.physics.p2.enable(r1);
                    rects.push(r1);
                }
            });
            try {
                map.setCollisionBetween(1, 1000, true, 'Walls'); //DEBUG
            } catch (err) {

            }
            mpxi = game.physics.p2.mpxi;
            layers[0].resizeWorld();
            tileObjects = game.physics.p2.convertTilemap(map, layers[layers.length - 2]);
            player = game.add.sprite(playerX, playerY, 'walker');
            counter = 0;
            while (counter != 16) {
                player.animations.add(counter, [counter * 9 + 1,
                    counter * 9 + 2,
                    counter * 9 + 3,
                    counter * 9 + 4,
                    counter * 9 + 5,
                    counter * 9 + 6,
                    counter * 9 + 7,
                    counter * 9 + 8
                ]);
                player.animations.add(counter + "idle", [counter * 9]);
                counter++;
            }
            game.physics.p2.enable(player, false);
            player.anchor.set(0.5, 0.8);
            player.body.setCircle(20);
            player.body.mass = 100;
            game.camera.follow(player);
            player.body.fixedRotation = true;
            if (map.objects.Walls) {
                player.body.setCollisionGroup(PCG);
                player.body.collides(WCG);
            }
            this.shadowTexture = this.game.add.bitmapData(this.game.width + 50, this.game.height + 50);
            this.lightSprite = this.game.add.image(this.game.camera.x, this.game.camera.y, this.shadowTexture);
            this.lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

            //ANIMATED TILES ON SIX TILE ROTATION
            doodadsLayer = map.getLayerIndex("!Doodads");
            var tileMapSearch = map.getTilesetIndex("adobe");
            if (tileMapSearch > -1 && tileMapSearch != null) {
                startID = map.tilesets[tileMapSearch].firstgid;
                animatedTiles.push(155 + startID);
                animatedTiles.push(161 + startID);
                animatedTiles.push(167 + startID);
            }


        },
        update: function() {
			try{
				if(navigator.userAgent.toLowerCase().indexOf('firefox') == -1){
					$('#suggestionInput').focus();
				}
				heroX = player.x - game.camera.x;
				heroY = player.y - game.camera.y;
				if (($('#main-mapContainer').hasClass('hiddenMap') != true) && player) {
                    if(this.input.keyboard.isDown(Phaser.Keyboard.L) && !lightClick){
                        lightClick = true;
                        ajaxCall("text", "createLight", rad, game.input.activePointer.worldX, game.input.activePointer.worldY);
                    }
                    if(!this.input.keyboard.isDown(Phaser.Keyboard.L)){
                        lightClick = false
                    }
					player.body.setZeroVelocity();
					active = true;
					if (reload == false) {
						ping++;
						player.body.mass = 100;
						player.body.angle = 0;

						if (ping == 10 || ping == 20) { //animations!
							animationFrame++;
							animatedTiles.forEach(function(tile) {
								if (animationFrame == 6) {
									map.replace(tile + animationFrame, tile + animationFrame - 5, 0, 0, 100, 100, doodadsLayer)
								} else {
									map.replace(tile + animationFrame, tile + animationFrame + 1, 0, 0, 100, 100, doodadsLayer)
								}

							});
							if (animationFrame == 6) {
								animationFrame = 0;
							}
						}

						if (ping == 20) {
							if (isNaN(playerX) || isNaN(playerY) || playerY < 0 || playerX < 0) {
								location.reload();
							}
							if (playerX != savedX || playerY != savedY) {
								locationCall(playerX, playerY, playerMap);
							}
							ping = 0;
						}

                        keyUp = this.input.keyboard.isDown(Phaser.Keyboard.W);
                        keyDown = this.input.keyboard.isDown(Phaser.Keyboard.S)
                        keyLeft = this.input.keyboard.isDown(Phaser.Keyboard.A)
                        keyRight = this.input.keyboard.isDown(Phaser.Keyboard.D)

                        if (keyUp && keyRight) {
                            player.body.velocity.y = - walk * .7;
                            player.body.velocity.x = walk * .7;
                            animationNumber = 6;
                            player.animations.play(animationNumber, 20, true);
                        } else if (keyDown && keyRight) {
                            player.body.velocity.y = walk * .7;
                            player.body.velocity.x = walk * .7;
                            animationNumber = 10;
                            player.animations.play(animationNumber, 20, true);
                        } else if (keyDown && keyLeft) {
                            player.body.velocity.x = - walk * .7;
                            player.body.velocity.y = walk * .7;
                            animationNumber = 14;
                            player.animations.play(animationNumber, 20, true);
                        } else if (keyUp && keyLeft) {
                            player.body.velocity.y = - walk * .7;
                            player.body.velocity.x = - walk * .7;
                            animationNumber = 2;
                            player.animations.play(animationNumber, 20, true);
                        } else if (keyUp) {
                            player.body.velocity.y = - walk;
                            animationNumber = 4;
							player.animations.play(animationNumber, 20, true);
						} else if (keyDown) {
                            player.body.velocity.y = walk;
                            animationNumber = 12;
							player.animations.play(animationNumber, 20, true);
                        } else if (keyLeft) {
                            player.body.velocity.x = - walk;
                            animationNumber = 0;
							player.animations.play(animationNumber, 20, true);
                        } else if (keyRight) {
                            player.body.velocity.x = walk;
                            animationNumber = 8;
							player.animations.play(animationNumber, 20, true);
						} else {
							player.animations.play(animationNumber + "idle", 1, true);
						}

						playerY = player.y;
						playerX = player.x;
						layerName = null;
						shop = 0;
						underground = 0;
						if (shadow && game.context.globalCompositeOperation == "multiply") {
							this.lightSprite.reset(this.game.camera.x, this.game.camera.y);
							this.updateShadowTexture();
						}

						layers.forEach(function(entry) {
							if ((map.getTileWorldXY(player.body.x, player.body.y, 48, 48, entry)) != null) {
								if (map.getTileWorldXY(player.body.x, player.body.y, 48, 48, entry).layer.name != "!Doodads" && map.getTileWorldXY(player.body.x, player.body.y, 48, 48, entry).layer.name != "Unwalkable Doodads") {
									layerName = map.getTileWorldXY(player.body.x, player.body.y, 48, 48, entry).layer.name; //Layer Name, Contains all flags
									level = map.getTileWorldXY(player.body.x, player.body.y, 48, 48, entry).layer.properties.level; //Holds zone monster level
									locationScript = map.getTileWorldXY(player.body.x, player.body.y, 48, 48, entry).layer.properties.script; //Holds layer description
									underground = map.getTileWorldXY(player.body.x, player.body.y, 48, 48, entry).layer.properties.underground; //If 1; adds overlay tint
									if (locationScript != null && layerName.charAt(0) != '#') {
										if (level == null || level == 0) {
											level = "N/A";
										}
                                        if (layerName.includes("BOSS")) {
                                            layerName2 = layerName.slice(0, -5);
                                        }else{
                                            layerName2 = layerName;
                                        }
										locationScript = '<strong>Location:</strong> ' + layerName2 + '<br/><br/><strong>Enemy Level: </strong>[level]<br/><br/><strong>Description: </strong>' + locationScript;
										locationScript = locationScript.replace('[level]', level);
									}
								}
							}
						});

						var objectType;
						var exitX;
						var exitY;

						$.each(rects, function(i, val) {
							if (val.intersects(hitbox)) {
								objectType = val.properties.type;
								npcID = val.properties.npcID;
								shopExitX = val.properties.x;
								shopExitY = val.properties.y;
								if (objectType != "portal" && objectType != "sign") {
									movePlayer();
								}

								if (objectType == "vendor" || objectType == "shop") {
									shop = npcID;
									ajaxCall("json", "getShopInfo", npcID);
									showDiv('main-shopContainer');
									$("#shopWrapper").hide();
									$("#shopLoading").show();
									disableMenu();
								} else if (objectType == "quest") {
									$("#questWrapper").children().hide();
									$('#questLoading').show();
									openQuest(npcID);
									disableMenu();
                                } else if (objectType == "crafting") {
                                    showDiv('main-craftContainer');
									disableMenu();
								} else if (objectType == "equipment") {
									shop = npcID;
									$("#equipShopWrapper").hide();
									$('#equipShopLoading').show();
									showDiv('main-equipShopContainer');
									ajaxCall("json", "getEquipShopInfo", npcID);
									disableMenu();
								} else if (objectType == "sign") {
									$("#divScript").html(val.properties.script);
								} else if (objectType == "portal") {
									if (reload == false) {

										map = val.properties.map;
										$('#loadingDiv').show();
										init_locationCode = shopExitX + "-" + shopExitY + "-" + map + "-" + init_locationCode.split('-')[3];
										locationCallNonAsync(shopExitX, shopExitY, map);
										shadow = "";
									}
								} else if (objectType == "spawn") {
									$("#teleLoading").show();
									$("#teleWrapper").hide();
									showDiv('main-teleContainer');
									ajaxCall("text", "getTeleInfo", val.properties.locationID);
									disableMenu();
								} else if (objectType == "healer") {
									showDiv('main-healerContainer');
									disableMenu();
								} else if (objectType == "stash") {

									showDiv('main-stashContainer');
									disableMenu();
                                    $("#stashTab-0").trigger("click");
								} else if (objectType == "corruptStone") {
									showDiv('main-corruptContainer');
                                    $("#corruptLoading").show();
                                    $("#corruptInnerDiv").hide();
                                    ajaxCall("text", "getEndlessTopFloor");
									disableMenu();
								}


							}
						});


						// * == Quest Layer
						// _ == Portal Layer
						// ^ == Shop Layer
						// % == Equipment Layer
						// @ == respawn layer
						// # == sign layer
						// + == healer layer
						// $ == stash layer

						if (layerName != null && layerName.charAt(0) != '!') {
							if (!mouseOverride) {
								$("#divScript").html(locationScript);
							}
							oldLoc = loc;
							if (layerName != loc) {
								loc = layerName;
								ajaxCall("text", "updateZone", layerName);

								if (($('#divLocation').html() == "" || !(layerName.includes("BOSS"))) && (oldLoc != layerName + " BOSS")) {
									if (layerName.includes("BOSS")) {
										$('#divLocation').html('Location: ' + layerName.slice(0, -5));
										showLocation(layerName.slice(0, -5), 1);
									} else {
										$('#divLocation').html('Location: ' + layerName);
										showLocation(layerName, level);
									}

								}

							}

						}
					}
				} else {
					player.body.setZeroVelocity();
					active = false;
				}
			}catch(ex){
                console.log(ex); //DEBUG
            }
        },
        updateShadowTexture: function(radius) {
            var sAgent = window.navigator.userAgent;
            var Idx = sAgent.indexOf("MSIE");
            shadowAnimation++;
            if (shadowAnimation == 10) {
                shadowAnimation = 0;
            }
			try {
				temp = this;
				counter = 0;
				$.each(shadow, function(index, entry) {
					x = entry.split('|')[0];
					y = entry.split('|')[1];
					radius = entry.split('|')[2];
					fade = entry.split('|')[3];
					//	fade = 0;
					flicker = parseInt(entry.split('|')[4]);
					if (!shadowAnimationFrame[counter]) {
						shadowAnimationFrame[counter] = flicker
					}

					if (counter == 0) {

						temp.shadowTexture.context.fillStyle = 'rgb(55, 55, 55)';
						temp.shadowTexture.context.fillRect(-100, -100, temp.game.width + 200, temp.game.height + 200);

						if (fade > 0) {
							var gradient =
								temp.shadowTexture.context.createRadialGradient(
									heroX, heroY, parseInt(radius) - parseInt(radius * (fade / 100)),
									heroX, heroY, radius);
							gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
							gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

						};
						temp.shadowTexture.context.beginPath();
						if (fade > 0) {
							temp.shadowTexture.context.fillStyle = gradient;
						} else {
							temp.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)'; //gradient;
						}
						temp.shadowTexture.context.arc(heroX, heroY, radius, 0, Math.PI * 2, false);
						temp.shadowTexture.context.fill();
					} else {

						if (fade > 0) {
							var gradient =
								temp.shadowTexture.context.createRadialGradient(
									(x - temp.camera.x), (y - temp.camera.y), shadowAnimationFrame[counter],
									(x - temp.camera.x), (y - temp.camera.y), radius);
							gradient.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
							gradient.addColorStop(1, 'rgba(255, 255, 255, 0.0)');

						};

						temp.shadowTexture.context.beginPath();
						if (fade > 0) {
							temp.shadowTexture.context.fillStyle = gradient;
						} else {
							temp.shadowTexture.context.fillStyle = 'rgb(255, 255, 255)'; //gradient;
						}
						temp.shadowTexture.context.arc((x - temp.camera.x), (y - temp.camera.y), radius, 0, Math.PI * 2, false);
						temp.shadowTexture.context.fill();

					}

					if (animationOn == 1 && shadowAnimation == 9) {
						x = parseInt(radius) - parseInt(radius * (fade / 100))
						currentFlicker = parseInt(Math.floor((Math.random() * flicker) + x / 2));
						shadowAnimationFrame[counter] = currentFlicker
					}
					temp.shadowTexture.dirty = true;
					counter++;
				});
			} catch (ex) {
				//console.log(ex); DEBUG
			}
        },
        render: function() {
            //game.debug.spriteBounds(player);
            //game.debug.body(player);
            //game.debug.text(game.time.fps || '--', 400, 300, "#21ff44");
            var bodyAABB = player.body.data.aabb;

            hitbox.x = mpxi(bodyAABB.upperBound[0]);
            hitbox.y = mpxi(bodyAABB.upperBound[1]);
            hitbox.right = mpxi(bodyAABB.lowerBound[0]);
            hitbox.bottom = mpxi(bodyAABB.lowerBound[1]);



            /*
            map.objects.Shapes.forEach(function(shape) {
              if (shape.rectangle) {
            	r1 = new Phaser.Rectangle(shape.x, shape.y, shape.width, shape.height);
            	game.debug.geom(r1);
              }
            });

            game.debug.geom(hitbox);
            */
        },

    };
    game.state.add('main', main_state);
	if(playerMap.length > 1){
		game.state.start('main');
	}
}

function destroyGame() {
    game.destroy();
    layers = [];
    rects = [];
    initGame();
}

function drawMinimap(){
    $('#mapImage').css("background-image", "url(../images/maps/" + playerMap + ".png)");
    if (playerMap == "VanaheimrNE") {
        $('#mapImage').css("width", "648px");
        $('#mapImage').css("height", "572px");
        $('#playerMarker').css("left", ((playerX / 11.1111) - 4) + "px");
        $('#playerMarker').css("top", ((playerY / 11.1111) - 4) + "px");
    }
    if (playerMap == "VanaheimrW") {
        $('#mapImage').css("width", "600px");
        $('#mapImage').css("height", "900px");
        $('#playerMarker').css("left", ((playerX / 8) - 4) + "px");
        $('#playerMarker').css("top", ((playerY / 8) - 4) + "px");
    }
    if (playerMap == "dampCave" || playerMap == "driedCave" || playerMap == "ridge" || playerMap == "sandyCaveN" || playerMap == "lowerSandyCave" || playerMap == "sandyCaveS" || playerMap == "okolnirNE" || playerMap == "okolnirNEE" || playerMap == "okolnirE" || playerMap == "cursedHouse" || playerMap == "rift" || playerMap == "okolnirSE" || playerMap == "okolnirSW" || playerMap == "lowerAssassinGuild" || playerMap == "sacredCave" || playerMap == "assassinGuild" || playerMap == "okolnirSS" || playerMap == "okolnirSSWW" || playerMap == "okolnirSSW") { //50x50
        $('#mapImage').css("width", "600px");
        $('#mapImage').css("height", "600px");
        $('#playerMarker').css("left", ((playerX / 4) - 4) + "px");
        $('#playerMarker').css("top", ((playerY / 4) - 4) + "px");
    }
    if (playerMap == "deepVeins") { //40x40
        $('#mapImage').css("width", "634px");
        $('#mapImage').css("height", "634px");
        $('#playerMarker').css("left", ((playerX / 3.028) - 1) + "px");
        $('#playerMarker').css("top", ((playerY / 3.028) - 1) + "px");
    }
    if (playerMap == "VanaheimrS" || playerMap == "VanaheimrN" || playerMap == "yggdrasil") { //100x100
        $('#mapImage').css("width", "600px");
        $('#mapImage').css("height", "600px");
        $('#playerMarker').css("left", ((playerX / 8) - 2) + "px");
        $('#playerMarker').css("top", ((playerY / 8) - 2) + "px");
    }
    if (playerMap == "UndergroundPassageW") { //100x120
        $('#mapImage').css("width", "720px");
        $('#mapImage').css("height", "600px");
        $('#playerMarker').css("left", ((playerX / 8) - 2) + "px");
        $('#playerMarker').css("top", ((playerY / 8) - 2) + "px");
    }
    if (playerMap == "okolnir") { //100x50
        $('#mapImage').css("width", "720px");
        $('#mapImage').css("height", "360px");
        $('#playerMarker').css("left", ((playerX / 6.6666) - 2) + "px");
        $('#playerMarker').css("top", ((playerY / 6.6666) - 2) + "px");
    }
    if (playerMap == "plaguedDen" || playerMap == "VanaheimrCavesS" || playerMap == "VanaheimrCavesN" || playerMap == "okolnirS" ) { //60x60
        $('#mapImage').css("width", "720px");
        $('#mapImage').css("height", "720px");
        $('#playerMarker').css("left", ((playerX / 4) - 2) + "px");
        $('#playerMarker').css("top", ((playerY / 4) - 2) + "px");
    }
    if (playerMap == "LowerVanaheimrCaves" || playerMap == "exileTunnel" || playerMap == "abandonedQuarry" || playerMap == "UndergroundPassageE") { //70x70, 20% zoom
        $('#mapImage').css("width", "672px");
        $('#mapImage').css("height", "672px");
        $('#playerMarker').css("left", ((playerX / 5) - 2) + "px");
        $('#playerMarker').css("top", ((playerY / 5) - 2) + "px");
    }
}

function ajaxCall(dataType, call, param1, param2, param3, param4, param5, param6, param7) { // - 2
    //  --------------------------------------------------------------------------------------------------
    //                   Generic AJAX controller, all inputs sanitized on PHP side
    //  --------------------------------------------------------------------------------------------------
    //console.log("attempting: " + call);
    $.ajax({
        type: "POST",
        dataType: dataType,
        data: {
            call: call,
            token: sessionToken,
            param1: param1,
            param2: param2,
            param3: param3,
            param4: param4,
            param5: param5,
            param6: param6,
            param7: param7
        },
        url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
        success: function(data) {
            delegateAjax(call, data);
        },

        error: function(xhr, status, error) {
			console.log(error);
		}
    });
}

function delegateAjax(call, data) {
    //  --------------------------------------------------------------------------------------------------
    //             This function delegates actions generated from the generic AJAX controller
    //  --------------------------------------------------------------------------------------------------
    if (data == "error! Invalid Session") {
        window.location.replace('kong_splash_v2.html');
    }
    debugReply = data;
    //console.log("reply: " + call + data)
    switch (call) {
        case "getLocation":
            initGame(data);
            break;
        case "checkCombat":
            postCombatCheck(data);
            break;
        case "populateCombatCard":
            if (data.indexOf("Invalid") == -1) {
                descripInfo = data.split('|')[6];
                $(".combatMonsterContainer").css("background-Color", data.split('|')[8])
                $(".combatMonsterContainer").css("background-image", "url(../images/portrits/" + data.split('|')[2] + ".png)")
                $("#divScript").html(descripInfo);
                $('.tooltiptwo').tooltipster();
            } else {
            }
            break;
        case "getShopInfo":
            storeInfo(data);
            break;
        case "getEquipShopInfo":
            equipStoreInfo(data);
            break;
        case "acceptQuest":
            movePlayer();
            enableMenu();
            break;
        case "cancelQuest":
            inventoryJSON = JSON.parse(JSON.parse(data));
            movePlayer();
            enableMenu();
            populateInv();
            break;
        case "completeQuest":
            init_char = JSON.parse(data.split('~')[0]);
            init_statusBar = JSON.parse(data.split('~')[1]);
            inventoryJSON = JSON.parse(data.split('~')[2]);
            populateCharPanel();
            populateStatus();
            populateInv();
            populateStash();
            //enableMenu();
			openQuest(npcID);
            generateSkillTree();
            //showDiv('main-mapContainer');
            break;
        case "destroyCombat":
            unloadCombat(data);
            break;
        case "useItem":
            filter = 0;

            init_statusBar = JSON.parse(data["status"]);
            populateStatus();
            populateMessage(data["message"]);
            init_equipment = data["equipment"];
            init_equipmentJSON = setInitEquipmentJSON(init_equipment);
            init_equips = JSON.parse(data["equippedItems"]);
            if (!init_equips || init_equips.length === 0) {
                init_equips = [-1, -1, -1, -1];
            }
            init_char = data["char"];
            inventoryJSON = JSON.parse(data["inventoryJSON"]);

            populateCharPanel();
            populateStatus();
            populateInv();
            populateStash();

            $(".items").removeClass("disabledButton");
            break;
        case "shopTransaction":
            saveMessage(data);
            populateInv();
            populateStash();
            break;
        case "equipShopTransaction":
            equipSaveMessage(data);
            populateInv();
            populateStash();
            break;
        case "addStat":
            init_char = JSON.parse(data.split('~')[0]);
            init_statusBar = JSON.parse(data.split('~')[1]);
            populateCharPanel();
            populateStatus();
            break;
        case "equipEquipment":
            init_char = JSON.parse(data.split('~')[0]);
            init_statusBar = JSON.parse(data.split('~')[1]);
            populateCharPanel();
            populateStatus();
            break;
        case "unequipEquipment":
            init_char = JSON.parse(data.split('~')[0]);
            init_statusBar = JSON.parse(data.split('~')[1]);
            populateCharPanel();
            populateStatus();
            break;
        case "getEquipment":
            init_equipment = data;
            init_equipmentJSON = setInitEquipmentJSON(data);
            populateInv();
            populateStash();
            break;
        case "getStatus":
            init_statusBar = JSON.parse(data);
            populateStatus();
            break;
        case "updateInventory":
            inventoryJSON = JSON.parse(data);
            populateInv();
            populateStash();
            break;
        case "getQuest":
            fakeQuest = data;
            populateQuestPage(data);
        case "getDailyQuest":
            populateQuestPage(data);
            break;
        case "getEnemyList":
            init_enemyList = data;
            populateBestiry();
            break;
        case "getRespawnInfo":
            $('#respawnText').html(data);
            $("#respawnWrapper").children().show();
            $('#respawnLoading').hide();
            break;
        case "allocateSkills":
            init_skills = JSON.parse(data.split('~')[1]);
            init_statusBar = JSON.parse(data.split('~')[0]);
            populateStatus();
            init_char = JSON.parse(data.split('~')[2]);
            populateCharPanel();
            generateSkillTree();
            break;
        case "useSkill":
            init_statusBar = JSON.parse(data.split('~')[2]);
            init_char = JSON.parse(data.split('~')[1]);
            $('#skillUseMessage').html(data.split('~')[0]);
            $("#skillUseMessage").show().delay(2000).fadeOut('slow');
            $(".multiUse").removeClass("disabledButton")
            populateStatus();
            populateCharPanel();
            generateSkillTree();
            break;
        case "equipSkill":
            init_statusBar = JSON.parse(data.split('~')[1]);
            populateStatus();
            init_char = JSON.parse(data.split('~')[0]);
            populateCharPanel();
            break;
        case "getWall":
            buildWall(data);
            $('#wallWrapper').show();
            $('#wallLoading').hide();
            break;
        case "getAchievementProgress":
            buildAchievementPage();
            setAchievements(JSON.parse(data));
            $('#achWrapper').show();
            $('#achLoading').hide();
            break;
        case "getQuestLog":
            $('#questLogWrapper').show();
            $('#questLogLoading').hide();
            populateCompleteQuestRows(JSON.parse(data.split('~')[0]));
            populateIncompleteQuestRows(JSON.parse(data.split('~')[1]));
            break;
        case "getQuestLogDetail":
            populateQuestLogDetail(data);
            break;
        case "getTeleInfo":
            populateTelePage(JSON.parse(data.split('~')[0]), data.split('~')[1]);
            break;
        case "setSpawn":
            $("#respawnText").html('<strong>Current Spawn Point: </strong>' + data)
            $(".setSpawn").addClass("savedSpawn");
            $(".setSpawn").html("Spawn Saved");
            break;
        case "teleport":
        case "towerTeleport":
            if (data == 0) {
                location.reload();
            }
            break;
        case "updateZone":
            if (data == 1) {
                showTeleActive();
            }
            break;
        case "getUsername":
            $("#login").html(data);
            break;
        case "softReset":
            if (data == 1) {
                location.replace("kong_reset.html");
            }
            break;
        case "restore":
            init_statusBar = JSON.parse(data.split('~')[2]);
            init_char = JSON.parse(data.split('~')[1]);
            $('#healerMsg').html(data.split('~')[0]);
            populateStatus();
            populateCharPanel();
            $('.tabs, .questTabs').removeClass("disabledButton");
            break;
        case "getShadow":
            shadow = data;
            destroyGame();
            break;
        case "charExist":
            if (data == "0") {
                location.replace("kong_reset.html");
            }
            break;
        case "getInventoryJSON":
            inventoryJSON = JSON.parse(data);
            populatePicker();
            break;
		case "getRecipe":
			data = JSON.parse(data);
            if(data == false){
                $("#craftNowBtn").addClass("disabledButton");
                $("#itemOutput").css("background-image", "url(../images/items/usable/question.png");
    			$("#itemOutputScript").html("");
    			$("#craftSuccess").html("N/A");
    			$("#craftCost").html("N/A");
                $("#craftCost").css("color", "white");
    			$("#craftNowBtn").attr("data-recipeID", -1);
            }else{
                $("#itemOutput").css("background-image", "url(../images/items/"+ data["image"] +".png)");
    			$("#itemOutputScript").html(data["card"]);
    			$("#craftSuccess").html(data["rateText"]);
    			$("#craftCost").html(data["costText"]);
                if(parseInt(data["cost"]) > init_char[4]){
                    $("#craftNowBtn").addClass("disabledButton");
                    $("#craftCost").css("color", "red");
                }else{
                    $("#craftNowBtn").removeClass("disabledButton");
                    $("#craftCost").css("color", "white");
                }
    			$("#craftNowBtn").attr("data-recipeID", data["recipeID"]);
            }
			break;
		case "craft":
            data = JSON.parse(data);
            if(data.includes("Success")){
                $('#craftResult').html("<span style='color:green'>" + data + "</span>");
            }else{
                $('#craftResult').html("<span style='color:red'>" + data + "</span>");
            }
            clearCrafting();
            $("#craftResult").show().delay(2000).fadeOut('slow');
            sync_char();
			break;
        case "combatAction":

            if(data.combatStatus1 == 2){
                unloadCombat();
            }else{
                populateCombatLog(JSON.parse(data.combatText1), JSON.parse(data.combatStatus2));
                init_statusBar = JSON.parse(data.charStatus1);
                inventoryJSON = JSON.parse(data.inventory);
                populateStatus();

                jQuery.eachAsync([1], {
                        delay: 250,
                        bulk: 0,
                        loop: function(index, value)
                        {
                            populateCombatLog(JSON.parse(data['combatText1']), JSON.parse(data.combatStatus2));
                            init_statusBar = JSON.parse(data['charStatus1']);
                            populateStatus();
                        },
                        end: function()
                        {
                            populateCombatLog(JSON.parse(data['combatText2']), JSON.parse(data.combatStatus2));
                            init_statusBar = JSON.parse(data['charStatus2']);
                            populateStatus();

                            if(data['combatStatus2'] == 1){
                                if(!combatLocked){
                                $('.combatButton').addClass("disabledButton");
                                $('#attackButton').removeClass("disabledButton");
                                $('#attackButton').html('Collect Loot');
                                $('#attackButton').css('background-image', 'url(../images/ui-buttons/combatLoot.png)');
                                }
                            }else if(data['combatStatus2'] == 3){
                                $('.combatButton').addClass("disabledButton");
                                $('#attackButton').removeClass("disabledButton");
                                $('#attackButton').html('Respawn');
                                $('#attackButton').css('background-image', 'url(../images/ui-buttons/combatRespawn.png)');
                                combatLocked = true;
                            }else{
                                combatLocked = false;
                            }
                        }
                });
            }
            break;
        case "getEndlessTopFloor":
            buildEndlessPanel(JSON.parse(data));
            $("#corruptLoading").hide();
            $("#corruptInnerDiv").show();
            break;
    }
}

function showDiv(div) {
    //  --------------------------------------------------------------------------------------------------
    //                 Hides all divs except the one passed in args.. used for main panel
    //  --------------------------------------------------------------------------------------------------
    $('div[id^="main-"]').each(function(index) {
        $(this).addClass("hiddenMap");
        $(this).removeClass("innerWrapper");
    });
    $('#' + div).removeClass("hiddenMap");
    $('#' + div).addClass("innerWrapper");
    $('.button').removeClass("selected");
}

function populateStatus() {
    //  --------------------------------------------------------------------------------------------------
    //                 Populates the top bar with information from init_statusBar
    //  --------------------------------------------------------------------------------------------------
    document.getElementById("divCharStuff").innerHTML = $(init_statusBar)[0];
    document.getElementById("divMana").innerHTML = $(init_statusBar)[1];
    document.getElementById("divHealth").innerHTML = $(init_statusBar)[2];
    document.getElementById("manaBar").style.backgroundPosition = $(init_statusBar)[3];
    document.getElementById("healthBar").style.backgroundPosition = $(init_statusBar)[4];
    document.getElementById("expBar").style.backgroundPosition = $(init_statusBar)[5];
    document.getElementById("divCurrency").innerHTML = formatNumber($(init_statusBar)[6]);
    split = $(init_statusBar)[7].split(" / ");
    exp = numberWithCommas(split[0]) + " / " + numberWithCommas(split[1])
    $('.expBar').attr('title', exp);
    buffHTML = '';
    buffs = init_statusBar[8].split("*");
    $('#combatTable').css('height', 'calc(100% - 50px)')
    $.each(buffs, function(index, value) {
        if (value.split('|')[0] != '') {
            buffHTML += '<div class="buff" data-script="' + value.split('|')[0]
            if (value.split('|')[2] > 0) {
                buffHTML += '<br/><br/>Battles Remaining: ' + value.split('|')[2]
            }
            buffHTML += '" style="background-image:url(../images/buffs/' + value.split('|')[1] + '.png);"></div>'
            $('#combatTable').css('height', 'calc(100% - 48px)')
        }
    });
    $('#buffs').html(buffHTML);
    $('.tooltip').tooltipster('content', exp);
    $('.displayItems').tooltipster({
        contentAsHTML: true,
    });
    populateCharPanel();

}

function populateCharPanel() {
    //  --------------------------------------------------------------------------------------------------
    //         Populates the char page with information from init_char and generates stat chart
    //  --------------------------------------------------------------------------------------------------
    $('#charLevelClass').html('Level ' + init_char[9] + '<br/>' + init_char[5]);
    if(parseInt(init_char[9]) > 15){
        $("#starterPack").hide();
    }else{
        $("#starterPack").show();
    }
    $('#statPoints').html(init_char[10]);
    $('#strPoints').html(init_char[6]);
    $('#dexPoints').html(init_char[7]);
    $('#sprPoints').html(init_char[8]);
    $('#vitPoints').html(init_char[18]);
    $('#charDef').html(init_char[18]);
    $('#charMDef').html(init_char[8]);
    $('#charName').html(init_char[12]);
    $('#statAttack').html(init_char[0]);
    $('#charAttack').html(init_char[1]);
    $('#charArmor').html(init_char[11]);
    $('#charDodge').html(init_char[2]);
    $('#statSteps').html(init_char[3]);
    $('#statFights').html(init_char[14]);
    $('#statDeaths').html(init_char[13]);
    $('#statSilver').html(init_char[4]);
    $('#statHealth').html(init_char[15]);
    $('#statMana').html(init_char[16]);
    $('#statRegen').html(init_char[17]);
    $('#charBlock').html(init_char[19]);
    $('#charCritChance').html(init_char[20]);
    $('#charCritMod').html(init_char[21]);
    $('#charFire').html(init_char[22]);
    $('#charIce').html(init_char[23]);
    $('#charEarth').html(init_char[24]);
    $('#charArcane').html(init_char[25]);
    $('#charHoly').html(init_char[26]);
    $('#freeSkillPoints').html(init_char[27]);
    $('#resetRewardList').html(init_char[29]);
    $('#currentExp').html('Current Experience ' + formatNumber($(init_statusBar)[7].split(' / ')[0]))
    $('#nextLevel').html('Next Level At: ' + formatNumber($(init_statusBar)[7].split(' / ')[1]))
    if (init_char[10] > 0) {
        $('.statAdd').addClass("statAddEnabled");
    }
    if (init_char[30] == 1) {
        $('#dailyBtn').click();
        init_char[30] = 0;
    }
}

function populateInv() {
    //  --------------------------------------------------------------------------------------------------
    //             Populates the inventory panel based on init_inventory counts
    //  --------------------------------------------------------------------------------------------------
    $(".equipmentItems").removeClass("disabledButton");
    populateEquip();
    invString = '';
    usableString = '';
    arrayLength = itemList.length;
    $.each(inventoryJSON, function(i, item) {
        if(item.equipment == 0 && item.visible == 1 && item.count > 0){
            itemType = item.usable + '|' + item.combat + '|' + item.quest + '|0';
            invString = invString + "<table id='item-" + item.itemID + "' style='float:left; width:33%;' data-type='"
            invString = invString + itemType + "'><tr><td style='width: 40px;'><div data-script='" + item.description
            invString = invString + "' data-type='" + itemType + "' data-id=" + item.itemID + " data-name='" + item.name + "' id='itemImage" + item.itemID
            invString = invString + "' class='items' style='background-image:url(../images/items/" + item.image + ".png)'>"
            invString = invString + item.count + "</div></td><td style='font-size: 14px;'>" + item.name + "</td></tr></table>";
        }

        if(item.usable == 1 && item.count > 0){
            class1 = 'multiUseItem';
            class5 = '';
            class25 = '';

            multiUseBlacklist = [1, 85, 89, 90, 91, 93, 108, 109, 110, 111, 112, 113, 114, 115, 127, 128, 129, 130, 119, 120, 236, 237, 238, 239]

            if (item.count >= 5 && multiUseBlacklist.indexOf(parseInt(item.itemID)) == -1) {
                class5 = 'multiUseItem';
            } else {
                class5 = 'notEnoughMana';
            }

            if (item.count >= 25 && multiUseBlacklist.indexOf(parseInt(item.itemID)) == -1) {
                class25 = 'multiUseItem';
            } else {
                class25 = 'notEnoughMana';
            }

            usableString = usableString + "<table style=\"width:370px;display:inline-block;padding-right:15px;\"><tr><td style=\"height: 52px;width: 52px;\"><div class=\"items forceCursor\" data-ItemID=\"";
            usableString = usableString + item.itemID + "\" data-script=\"" + item.description.replace("'", "&#39;") + "\" id=\"usable-" + item.itemID + "\" style=\"background-image:url(../images/items/" + item.image + ".png)\">" + item.count + "</div></td>";
            usableString = usableString + "<td style=\"padding-left:15px;font-size:14px;width:180px\">" + item.name + "</td>"
            usableString = usableString + "<td style=\"width:48px;\"><div data-script=\"" + item.description.replace("'", "&#39;") + "\" class=\"multiUse " + class1 + "\" data-use=\"1\" data-itemID=\"" + item.itemID + "\" style=\"background-image:url(../images/ui-buttons/use1.png)\"></div></td>"
            usableString = usableString + "<td style=\"width:48px;\"><div data-script=\"" + item.description.replace("'", "&#39;") + "\" class=\"multiUse " + class5 + "\" data-use=\"5\" data-itemID=\"" + item.itemID + "\" style=\"background-image:url(../images/ui-buttons/use5.png)\"></div></td>"
            usableString = usableString + "<td style=\"width:48px;\"><div data-script=\"" + item.description.replace("'", "&#39;") + "\" class=\"multiUse " + class25 + "\" data-use=\"25\" data-itemID=\"" + item.itemID + "\" style=\"background-image:url(../images/ui-buttons/use25.png)\"></div></td>"
            usableString = usableString + "</tr></table>"
        }
    })

    itemType = "0|0|0|1";
    $('div[ID^="equipped-"]').each(function() {
        $(this).attr("data-itemID", "0")
        slot = ($(this).attr("id").substring(9, $(this).attr("id").length));
        if (slot == "Accessory1") {
            $(this).css("background-image", "url(../images/layout/slotAccessory.png)");
            $("#acc1SlotText").html("unequipped");
            $("#acc1SlotText").css("font-style", "italic");
        } else if (slot == "Accessory2") {
            $(this).css("background-image", "url(../images/layout/slotAccessory.png)");
            $("#acc2SlotText").html("unequipped");
            $("#acc2SlotText").css("font-style", "italic");
        } else {
            $("#" + slot + "SlotText").html("unequipped");
            $("#" + slot + "SlotText").css("font-style", "italic");
            slot = slot.charAt(0).toUpperCase() + slot.substr(1);
            $(this).css("background-image", "url(../images/layout/slot" + slot + ".png)");
        }
        $(this).attr("data-script", "An empty equipment slot.")
    });

    $.each(init_equipmentJSON,function(i,v){
        if (v["stored"] == 0) {
            if([51,52,53,54,55,56,57,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74].indexOf(parseInt(v["template"])) > -1){
                name = '<span style="color:#ff6a01">' + v["name"] + "</span>"
            }else if([83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104].indexOf(parseInt(v["template"])) > -1){
                name = '<span style="color:#cc00ff">' + v["name"] + "</span>"
            }else if (v["script2"] != "0") {
                name = '<span style="color:gold">' + v["name"] + "</span>"
            }else{
                name = v["name"];
            }
            slot = v["slot"];
            if (v["equipped"] != 1) {
                invString = invString + "<table class='itemTable' id='item-" + i + "' style='float:left; width:33%;' data-type='0|0|0|1"
                invString = invString + "' data-class='" + v["slot"] + "'><tr><td style='width: 40px;'><div data-script='" + v["script1"]
                invString = invString + "' data-id='" + i + "' data-type='" + itemType + "' data-name='" +  v["name"] + "' id='unequipped-" + i
                invString = invString + "' class='items' style='background-image:url(../images/items/" + v["image"] + ".png)'>"
                invString = invString + "</div></td><td style='font-size: 14px;'>" + name + "</td></tr></table>";
            } else {
                if (slot == "accessory") {
                    if ($('#equipped-Accessory1').attr("data-itemID") == 0) {
                        $('#equipped-Accessory1').attr("data-itemID", i)
                        $('#equipped-Accessory1').attr("data-script", v["script1"])
                        $('#equipped-Accessory1').css("background-image", "url(../images/items/" + v["image"] + ".png)");
                        $('#equipped-Accessory1').css("cursor", "pointer");
                        $('#acc1SlotText').css("font-style", "");
                        $('#acc1SlotText').html(name);
                    } else {
                        $('#equipped-Accessory2').attr("data-itemID", i)
                        $('#equipped-Accessory2').attr("data-script", v["script1"])
                        $('#equipped-Accessory2').css("background-image", "url(../images/items/" + v["image"] + ".png)");
                        $('#equipped-Accessory2').css("cursor", "pointer");
                        $('#acc2SlotText').css("font-style", "");
                        $('#acc2SlotText').html(name);
                    }
                } else if (slot == "2hweapon") {
                    slot = "weapon";
                    $('#equipped-' + slot).attr("data-itemID", i)
                    $('#equipped-' + slot).css("background-image", "url(../images/items/" + v["image"] + ".png)");
                    $('#equipped-' + slot).css("cursor", "pointer");
                    $('#equipped-' + slot).attr("data-script", v["script1"])
                    $('#' + slot + 'SlotText').css("font-style", "");
                    $('#' + slot + 'SlotText').html(name);
                    slot = "offhand";
                    $('#equipped-' + slot).attr("data-itemID", i)
                    $('#equipped-' + slot).css("background-image", "url(../images/items/" + v["image"] + ".png)");
                    $('#equipped-' + slot).css("cursor", "pointer");
                    $('#equipped-' + slot).attr("data-script", v["script1"])
                    $('#' + slot + 'SlotText').css("font-style", "");
                    $('#' + slot + 'SlotText').html(name);
                } else {
                    $('#equipped-' + slot).attr("data-itemID", i)
                    $('#equipped-' + slot).css("background-image", "url(../images/items/" + v["image"] + ".png)");
                    $('#equipped-' + slot).css("cursor", "pointer");
                    $('#equipped-' + slot).attr("data-script", v["script1"])
                    $('#' + slot + 'SlotText').css("font-style", "");
                    $('#' + slot + 'SlotText').html(name);
                }
            }
        }
    });

    $("#itemList").html(invString);
    $("#usableList").html(usableString);
    filterItems(filter);

}

function populatePicker() {
    //  --------------------------------------------------------------------------------------------------
    //             TO DO
    //  --------------------------------------------------------------------------------------------------
    pickerString = '';

    $('.craftingSelector').each(function(){
        try{
            inventoryJSON[$(this).attr("data-uid")]["count"]--;
        }catch(err){}
    });

    $.each(inventoryJSON, function(i, item) {
        if((item.archived != 1 && item.equipment == 1 && item.count > 0 && item.equipped == 0) || (item.equipment == 0 && item.count > 0 && item.quest == 0)){
            pickerString = pickerString + "<table id='picker-" + item.itemID + "' style='float:left; width:33%;'><tr><td style='width: 40px;'><div data-equip=0"
            pickerString = pickerString + "' class='pickerItems' data-name='" + item.name + "' data-uid=" + i + " style='background-image:url(../images/items/" + item.image + ".png)'>"
            pickerString = pickerString + item.count + "</div></td><td style='font-size: 14px;'>" + item.name + "</td></tr></table>";
        }
    })
	$("#itemSelectList").html(pickerString);
    $(".pickerItems").on("click", function() {
        ret = $(this).attr("data-uid");
        $.fancybox.close();
    })
}

function filterItems(fil) {
    //  --------------------------------------------------------------------------------------------------
    //            Filters items on the inventory page, only showing items on the selected tab
    //            --Called on .html page
    //  --------------------------------------------------------------------------------------------------
    filter = fil;
    if (filter != 0) {
        $("#itemList").show();
        $("#usableList").hide();

        $('div[id^="invTab-"]').each(function(index) {
            $(this).removeClass("clickedShop");
            $('#invHeader').html('');
            if ($(this).attr("id") == 'invTab-' + filter) {
                $(this).addClass("clickedShop");
            }
        });
        if (filter == 1) {
            $('#equipContainer').show();
        } else {
            $('#equipContainer').hide();
        }
        if (filter == 3) {
            $(".filterButtons").removeClass("upOne");
            $('#equipmentContainer').show();
        } else {
            $('#equipmentContainer').hide();
        }
        $('table[ID^="item-"]').each(function(index) {
            type = $(this).attr('data-type');
            if (filter == 3) {
                if (type == '0|0|0|1') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else if (filter == 4) {
                if (type == '0|0|0|0') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }  else if (filter == 1) {
                if (type == '1|1|0|0' || type == '0|1|0|0') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else if (filter == 2) {
                if (type == '0|0|1|0') {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        });
    } else {
        $(".tabs").removeClass("clickedShop");
        $("#invTab-0").addClass("clickedShop");
        $('#equipContainer').hide();
        $('#equipmentContainer').hide();
        $("#itemList").hide();
        $("#usableList").show();
    }
}

function filterStash(fil) {
    //  --------------------------------------------------------------------------------------------------
    //            Filters items on the inventory page, only showing items on the selected tab
    //            --Called on .html page    WRONGGGG@!!!!!!
    //  --------------------------------------------------------------------------------------------------
    filterStashVar = fil
    descripInfo = "Keep things here to stay organized!"
    $("#divScript").html(descripInfo);
    reFilterStashEquips()
}

function populateEquip() {
    //  --------------------------------------------------------------------------------------------------
    //            			Populates the equipped items panel on the inventory page
    //  --------------------------------------------------------------------------------------------------
    equipString = '<table style="width:100%; margin-top: 15px;"><tr>';
    counter = 0;
    newString = '';
    while (counter != 4) {

        if (init_equips[counter] < 0) {
            newString = newString + '<td style="width:60px;"><div id="equippedImage' + (counter + 1) + '"';
            newString = newString + 'data-script="blag" class="noItems"';
            newString = newString + 'style="background-image:url(../images/layout/slotCombat.png);margin:0 auto;">';
        } else {
            item = getInventoryJSONRecord(init_equips[counter]);
            newString = newString + '<td style="width:60px;"><div id="equippedImage' + (counter + 1) + '"';
            newString = newString + 'data-script="' + item.description + '" class="items" ';
            newString = newString + 'style="background-image:url(../images/items/' + item.image + '.png); margin:0 auto;">';
        }
        counter++;
    }

    equipString = equipString + newString + '</tr></table>'
    $('#charEquipContainer').html(equipString);
    equipString = equipString + '<div style="width:400px; height:8px; margin-left:-10px; margin-top:5px; background-image:url(../images/layout/spannerSmall.png)"></div>';
    $('#equipContainer').html(equipString);

}

function populateEquippedSkills() {
    //  --------------------------------------------------------------------------------------------------
    //            			Populates the equipped skills panel on the skill tree page
    //  --------------------------------------------------------------------------------------------------
    equipString = '<table style="width:300px; margin: 15px auto;"><tr>';
    counter = 0;
    newString = '';
    if (!init_eSkills || init_eSkills.length === 0) {
        init_eSkills = [-1, -1, -1, -1];
    }

    while (counter != 4) {
        counter++;
        if (init_eSkills[counter - 1] < 0 || init_eSkills[counter - 1] == null) {
            newString = newString + '<td style="width:60px;"><div id="equippedSkillImage' + counter + '"';
            newString = newString + 'data-script="blag" class="noSkills"';
            newString = newString + 'style="background-image:url(../images/ui-buttons/emptySpell.png);margin:0 auto;">';
        } else {
            newString = newString + '<td style="width:60px;"><div id="equippedSkillImage' + counter + '"';
            newString = newString + ' class="items openSkill" ';
            newString = newString + 'style="background-image:url(../images/skills/' + skillList[init_eSkills[counter - 1] - 1].split('|')[2] + '.png); margin:0 auto;">';
        }
    }
    equipString = equipString + newString + '</tr></table>'
    $('#charSkillContainer').html(equipString);
    equipString = equipString + '<div style="width:400px; height:8px; margin:0 auto; background-image:url(../images/layout/spannerSmall.png)"></div>';
    $('#equippedSkillsDiv').html(equipString);
}

function postCombatCheck(combatLog) {
    //  --------------------------------------------------------------------------------------------------
    //         This function runs after a combat check is done on startup, if the player is
    //         in combat, combat is initialized, if not, the map is initialized
    //  --------------------------------------------------------------------------------------------------
    if (combatLog != "empty") {
        initCombat(combatLog);
    } else {
        initGame();
    }
}

function showLocation(loc, enemyFlag) {
    //  --------------------------------------------------------------------------------------------------
    //                Fades in and out a label showing the location player just entered
    //  --------------------------------------------------------------------------------------------------
    $("#OnScreenText").html('<strong>' + loc + '</strong>');
    $("#OnScreenText").fadeIn();
    if(enemyFlag != "N/A"){
        $('.shiftingColor').removeClass('borderBlue', 500).addClass('borderOJ', 500);
    }else{
        $('.shiftingColor').removeClass('borderOJ', 500).addClass('borderBlue', 500);
    }
    setTimeout(function() {
        $("#OnScreenText").fadeOut(1000)
    }, 4000);
}

function showTeleActive() {
    //  --------------------------------------------------------------------------------------------------
    //                Fades in and out a label showing the location player just entered
    //  --------------------------------------------------------------------------------------------------
    $("#teleportText").html('<strong>Teleblisk Activated!</strong>');
    $("#teleportText").fadeIn();
    setTimeout(function() {
        $("#teleportText").fadeOut(1000)
    }, 3000);
}

function locationCall(pX, pY, newMap) {
    //  --------------------------------------------------------------------------------------------------
    //                If the map is visible, sends the location to the server
    //                -- NOTE: No disconnection detection exists currently
    //  --------------------------------------------------------------------------------------------------
    if (($('#gameCanvas').is(':visible')) || (override && reload == false)) {
        savedX = pX;
        savedY = pY;
        ajaxCall2 = $.ajax({
            type: "POST",
            dataType: "text",
            url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
            data: {
                async: "yes",
                X: pX,
                Y: pY,
                map: newMap,
                token: sessionToken,
                call: "updateLocation"
            },
            success: locationStore,
        });
    } else {
        locationStore(null);
    }
}

function locationCallNonAsync(pX, pY, newMap) {
    //  --------------------------------------------------------------------------------------------------
    //                Forces the server to change maps player is on without async
    //  --------------------------------------------------------------------------------------------------
    $.ajax({
        async: false,
        type: "POST",
        dataType: "text",
        url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
        data: {
            async: "no",
            X: pX,
            Y: pY,
            map: newMap,
            token: sessionToken,
            call: "updateLocation"
        },
        success: reloadMap,
    });
}

function reloadMap(code) {
    ajaxCall("json", "getShadow");
}

function locationStore(code) {

    //  --------------------------------------------------------------------------------------------------
    //                Stores the location, if the session is invalid, forces a logout
    //  --------------------------------------------------------------------------------------------------
    if (code == 'error! Invalid Session') {
        window.location.replace('kong_splash.html');
    } else if (code > 0) {
        ajaxCall("json", "checkCombat");
    }
}

function openQuest(id) {
    showDiv('main-questContainer');
    $('#main-questContainer').html(questPanel);
    $('.scrollbar-inner').scrollbar();
    $('#questRight').on("click", function() {
        movePlayer();
        showDiv('main-mapContainer');
        enableMenu();
        $('#mapBtn').addClass("selected");
    });
    $('#questLeave').on("click", function() {
        movePlayer();
        showDiv('main-mapContainer');
        enableMenu();
        $('#mapBtn').addClass("selected");
    });
    $('#questComplete').on("click", function() {
        movePlayer();
        showDiv('main-mapContainer');
        enableMenu();
        $('#mapBtn').addClass("selected");
    });
    $('#questLeft').on("click", function() {
        if ($(this).html() == "Accept Quest") {
            ajaxCall("text", "acceptQuest", $(this).attr("data-id"));
        }
        if ($(this).html() == "Cancel Quest") {
            ajaxCall("text", "cancelQuest", $(this).attr("data-id"));
        }
        if ($(this).html() == "Collect Reward") {
            ajaxCall("text", "completeQuest", $(this).attr("data-id"));
        }
    });
    ajaxCall('text', 'getQuest', id);
}

function populateQuestPage(data) {
    if (dailyQuest) {
        dailyQuest = false;
        questInfo = (JSON.parse(data));
        $('.dailyItem').removeClass("dailyLocked");
        $('.dailyItem').removeClass("dailyDone");
        $('#dailyQuestPanel').removeClass("smallDailyQuestPanel");
        $('#dailyQuestPanel').removeClass("medDailyQuestPanel");
        $('#dailyAccept').hide();
        $('#dailyInnerDiv').show();
        if (questInfo.questID == 27) {
            $('#day2').addClass("dailyLocked");
            $('#day3').addClass("dailyLocked");
            $('#day4').addClass("dailyLocked");
            $('#day5').addClass("dailyLocked");
        } else if (questInfo.questID == 28) {
            $('#day1').addClass("dailyDone");
            $('#day3').addClass("dailyLocked");
            $('#day4').addClass("dailyLocked");
            $('#day5').addClass("dailyLocked");
        } else if (questInfo.questID == 29) {
            $('#day1').addClass("dailyDone");
            $('#day2').addClass("dailyDone");
            $('#day4').addClass("dailyLocked");
            $('#day5').addClass("dailyLocked");
        } else if (questInfo.questID == 30) {
            $('#day1').addClass("dailyDone");
            $('#day2').addClass("dailyDone");
            $('#day3').addClass("dailyDone");
            $('#day5').addClass("dailyLocked");
        } else if (questInfo.questID == 31) {
            $('#day1').addClass("dailyDone");
            $('#day2').addClass("dailyDone");
            $('#day3').addClass("dailyDone");
            $('#day4').addClass("dailyDone");
        }
        if (questInfo.status == null) { //NOT STARTED
            dailyComplete = 'false';
            $('#dailyAccept').show();
            $('#dailyAccept').html("Start Quest");
            $('#questText').html(questInfo.startText);

            for (i = 1; i < 4; i++) {
                if(questInfo["req-" + i] != 0){
                    item = getInventoryJSONRecord(questInfo["req-" + i]);
                    $('#daily' + i + 'row').show();
                    $('#daily' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');
                    if(item.visible == 1){
                        $('#daily' + i).html(item.name + " - " + questInfo["amnt-" + i] + " Required");
                    }else{
                        if (questInfo["amnt-" + i] > 1) {
                            $('#daily' + i).html(item.name + " - " + questInfo["amnt-" + i] + " Kills");
                        } else {
                            $('#daily' + i).html(item.name + " - 1 Kill");
                        }
                    }
                }else{
                    $('#daily' + i + 'row').hide();
                }
            }

            for (i = 1; i < 4; i++) {
                if(questInfo["reward-" + i] != 0){
                    item = getInventoryJSONRecord(questInfo["reward-" + i]);
                    $('#dailyReward' + i + 'row').show();
                    $('#dailyReward' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');
                    $('#dailyReward' + i).html(item.name + " - " + questInfo["rAmnt-" + i] + " Rewarded");
                } else {
                    $('#dailyReward' + i).hide();
                }
            }

            if (questInfo["expAmnt"] != 0) {
                $('#dailyRewardErow').show();
                $('#dailyRewardEimage').css("background-image", "url(../images/items/misc/exp.png)");
                $('#dailyRewardEXP').html("Experience - " + formatNumber(questInfo["expAmnt"]) + " Rewarded");
            } else {
                $('#dailyRewardErow').hide();
            }
            if (questInfo["silverAmnt"] != 0) {
                $('#dailyRewardSrow').show();
                $('#dailyRewardSimage').css("background-image", "url(../images/items/misc/silver.png)");
                $('#dailyRewardSilver').html("Silver - " + formatNumber(questInfo["silverAmnt"]) + " Rewarded");
            } else {
                $('#dailyRewardSrow').hide();
            }

        } else if (questInfo["status"] == "working") { //UNDER WAY
            complete = true;
            for (i = 1; i < 4; i++) {
                if(questInfo["req-" + i] != 0){
                    item = getInventoryJSONRecord(questInfo["req-" + i]);
                    $('#daily' + i).show();
                    string = '';

                    if(questInfo["amnt-" + i] == item.count){
                        string = '<span style="color:green;"><strong>' + item.count + '/' + item.count + '</strong></span>';
                    }else{
                        string = '<span style="color:red;"><strong>' + item.count + '/' + questInfo["amnt-" + i] + '</strong></span>';
                        complete = false;
                    }
                    $('#daily' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');

                    if(item.visible == 1){
                        $('#daily' + i).html(item.name + " - " + string + " Collected");
                    } else {
                        $('#daily' + i).html(item.name + " - " + string + " Slain");
                    }
                }else{
                    $('#daily' + i).hide();
                }
            }
            for (i = 1; i < 4; i++) {
                if(questInfo["reward-" + i] != 0){
                    item = getInventoryJSONRecord(questInfo["reward-" + i]);
                    $('#dailyReward' + i + 'row').show();
                    $('#dailyReward' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');
                    $('#dailyReward' + i).html(item.name + " - " + questInfo["rAmnt-" + i] + " Rewarded");
                } else {
                    $('#dailyReward' + i).hide();
                }
            }

            if (questInfo["expAmnt"] != 0) {
                $('#dailyRewardErow').show();
                $('#dailyRewardEimage').css("background-image", "url(../images/items/misc/exp.png)");
                $('#dailyRewardEXP').html("Experience - " + formatNumber(questInfo["expAmnt"]) + " Rewarded");
            } else {
                $('#dailyRewardErow').hide();
            }
            if (questInfo["silverAmnt"] != 0) {
                $('#dailyRewardSrow').show();
                $('#dailyRewardSimage').css("background-image", "url(../images/items/misc/silver.png)");
                $('#dailyRewardSilver').html("Silver - " + formatNumber(questInfo["silverAmnt"]) + " Rewarded");
            } else {
                $('#dailyRewardSrow').hide();
            }
            if (complete) {
                $('#dailyAccept').show();
                dailyComplete = 'true';
                $('#dailyAccept').html("Claim Reward");
            }else{
                $('#dailyQuestPanel').addClass("medDailyQuestPanel");
            }
        } else if (questInfo["status"] == "complete") {
            $('#day' + (questInfo["questID"] - 26)).addClass("dailyDone");
            $('#dailyInnerDiv').hide();
            $('#dailyQuestPanel').addClass("smallDailyQuestPanel");
        }
    } else {  //NOT DAILY
        descripInfo = "Complete quests for bonus rewards in your time hunting.";
        $("#divScript").html(descripInfo);
        $("#questWrapper").children().show();
        $('#questLoading').hide();
        questInfo = (JSON.parse(data));
        $('#questLeft').attr("data-id", questInfo.questID);
        if (questInfo.status == null) { //NOT STARTED
            dailyComplete = 'false';
            $('#questAccept').show();
            $('#questAccept').html("Start Quest");
            $('#questText').html(questInfo.startText);

            for (i = 1; i < 4; i++) {
                if(questInfo["req-" + i] != 0){
                    item = getInventoryJSONRecord(questInfo["req-" + i]);
                    $('#req' + i + 'row').show();
                    $('#req' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');
                    if(item.visible == 1){
                        $('#req' + i).html(item.name + " - " + questInfo["amnt-" + i] + " Required");
                    }else{
                        if (questInfo["amnt-" + i] > 1) {
                            $('#req' + i).html(item.name + " - " + questInfo["amnt-" + i] + " Kills");
                        } else {
                            $('#req' + i).html(item.name + " - 1 Kill");
                        }
                    }
                }else{
                    $('#daily' + i + 'row').hide();
                }
            }

            for (i = 1; i < 4; i++) {
                if(questInfo["reward-" + i] != 0){
                    item = getInventoryJSONRecord(questInfo["reward-" + i]);
                    $('#reward' + i + 'row').show();
                    $('#reward' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');
                    $('#reward' + i).html(item.name + " - " + questInfo["rAmnt-" + i] + " Rewarded");
                } else {
                    $('#reward' + i).hide();
                }
            }

            if (questInfo["expAmnt"] != 0) {
                $('#rewardErow').show();
                $('#rewardEimage').css("background-image", "url(../images/items/misc/exp.png)");
                $('#rewardEXP').html("Experience - " + formatNumber(questInfo["expAmnt"]) + " Rewarded");
            } else {
                $('#rewardErow').hide();
            }
            if (questInfo["silverAmnt"] != 0) {
                $('#rewardSrow').show();
                $('#rewardSimage').css("background-image", "url(../images/items/misc/silver.png)");
                $('#rewardSilver').html("Silver - " + formatNumber(questInfo["silverAmnt"]) + " Rewarded");
            } else {
                $('#rewardSrow').hide();
            }
            $('#questLeft').html("Accept Quest");
            $('#questLeft').css("background-image", "url(../images/ui-buttons/quest_accept.png)");
        } else if (questInfo.status == "working") {
            complete = true;
            $('#questText').html(questInfo.startText);

            for (i = 1; i < 4; i++) {
                if(questInfo["req-" + i] != 0){
                    item = getInventoryJSONRecord(questInfo["req-" + i]);
                    $('#req' + i).show();
                    string = '';

                    if(questInfo["amnt-" + i] == item.count){
                        string = '<span style="color:green;"><strong>' + item.count + '/' + item.count + '</strong></span>';
                    }else{
                        string = '<span style="color:red;"><strong>' + item.count + '/' + questInfo["amnt-" + i] + '</strong></span>';
                        complete = false;
                    }
                    $('#req' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');

                    if(item.visible == 1){
                        $('#req' + i).html(item.name + " - " + string + " Collected");
                    } else {
                        $('#req' + i).html(item.name + " - " + string + " Slain");
                    }
                }else{
                    $('#req' + i).hide();
                }
            }

            for (i = 1; i < 4; i++) {
                if(questInfo["reward-" + i] != 0){
                    item = getInventoryJSONRecord(questInfo["reward-" + i]);
                    $('#reward' + i + 'row').show();
                    $('#reward' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');
                    $('#reward' + i).html(item.name + " - " + questInfo["rAmnt-" + i] + " Rewarded");
                } else {
                    $('#reward' + i).hide();
                }
            }

            if (questInfo["expAmnt"] != 0) {
                $('#rewardErow').show();
                $('#rewardEimage').css("background-image", "url(../images/items/misc/exp.png)");
                $('#rewardEXP').html("Experience - " + formatNumber(questInfo["expAmnt"]) + " Rewarded");
            } else {
                $('#rewardErow').hide();
            }
            if (questInfo["silverAmnt"] != 0) {
                $('#rewardSrow').show();
                $('#rewardSimage').css("background-image", "url(../images/items/misc/silver.png)");
                $('#rewardSilver').html("Silver - " + formatNumber(questInfo["silverAmnt"]) + " Rewarded");
            } else {
                $('#rewardSrow').hide();
            }

            if (complete) {
                $('#questText').html(questInfo.finishText);
                $('#questLeft').html("Collect Reward");
                $('#questLeft').css("background-image", "url(../images/ui-buttons/combatLoot.png)");
            } else {
                $('#questLeft').html("Cancel Quest");
                $('#questLeft').css("background-image", "url(../images/ui-buttons/quest_decline.png)");
            }
            $("#questInnerDiv").children().show();
            $('#questComplete').hide();
        } else if (questInfo["status"] == "complete") {
            $("#questInnerDiv").children().hide();
            $('#questText').show();
            $('#questComplete').show();
            $('#questText').html(questInfo.completeText);

        }
    }
}

function storeInfo(storeJSON) {
    //  --------------------------------------------------------------------------------------------------
    //                             Stores the information for entered shop
    //  --------------------------------------------------------------------------------------------------
    descripInfo = "<strong>Shop: </strong>" + storeJSON['shopName'] + "<br/><br/>" + storeJSON['welcome'];
    $("#divScript").html(descripInfo);
    buildShop(storeJSON);
}

function equipStoreInfo(xml) {
    //  --------------------------------------------------------------------------------------------------
    //                             Stores the information for entered shop
    //  --------------------------------------------------------------------------------------------------
    shopInfo = xml
    descripInfo = "<strong>Shop: </strong>" + xml[10] + "<br/><br/>" + xml[11];
    $("#divScript").html(descripInfo);
    buildEquipShop(xml);
}

function initCombat(log) {
    //  --------------------------------------------------------------------------------------------------
    //        Initializes combat, hiding map, showing combat div, and disabling menu buttons
    //  --------------------------------------------------------------------------------------------------
    populateCharPanel();
    disableMenu();
    $('.shiftingColor').removeClass('borderOJ', 500).addClass('borderRed', 500);
    populateCombatLog(log)
    ajaxCall("text", "populateCombatCard");
    active = false;
    $('#main-mapContainer').fadeOut(50);
    $('#main-mapContainer').addClass('hiddenMap');
    $('#main-mapContainer').removeClass("innerWrapper");
    $('div[id^="main-"]').addClass("hiddenMap");
    $('#main-combatContainer').addClass("innerWrapper");
    $('#main-combatContainer').removeClass('hiddenMap');
    $('#main-combatContainer').hide();
    $('#main-combatContainer').fadeIn(300);
    $('#combatText').scrollTop($('#combatText').prop("scrollHeight"));
    $('#attackButton').html('Attack');
    $('#attackButton').css('background-image', 'url(../images/ui-buttons/CombatAttack.png)');
    $('.combatButton').each(function(index) {
        if ($(this).hasClass("items")) {
            if ($(this).html() != "0" && $(this).html() != "") {
                $(this).removeClass("disabledButton");
            }else if ($(this).html() == "0"){
                $(this).addClass("disabledButton");
            }
        } else if ($(this).hasClass("skillContainer")) {

            if ($(this).attr("data-cost") != "" && $(this).attr("data-cost") <= parseInt(init_statusBar[1].split("/")[0].replace(",", "")) && $(this).attr("data-ID") != 22 &&
                $(this).attr("data-ID") != 29 &&
                $(this).attr("data-ID") != 30 &&
                $(this).attr("data-ID") != 31 &&
                $(this).attr("data-ID") != 32) {
                $(this).removeClass("disabledButton");
            } else {
                $(this).addClass("disabledButton");
            }
        } else {
            $(this).removeClass("disabledButton");
        }
    });
}

function populateCombatLog(log, status = 0) {
    //  --------------------------------------------------------------------------------------------------
    //        Populates the log div on the combat screen from the database, scrolls to bottom
    //        Also populates combat items and soon skills
    //  --------------------------------------------------------------------------------------------------
    counter = 0;
    while (counter != 4) {
        itemIndex = init_equips[counter];
        if (itemIndex != -1) {
            item = getInventoryJSONRecord(itemIndex)
            $("#combatItem-" + (counter + 1)).css("background-image", "url(../images/items/" + item.image + ".png)");
            $("#combatItem-" + (counter + 1)).addClass("combatIcons");
            $("#combatItem-" + (counter + 1)).html(item.count);
            $("#combatItem-" + (counter + 1)).css("opacity", "");
            $("#combatItem-" + (counter + 1)).data("id", item.itemID);
            $("#combatItem-" + (counter + 1)).attr("data-script", item.description);
        } else {
            $("#combatItem-" + (counter + 1)).removeClass("combatIcons");
            $("#combatItem-" + (counter + 1)).css("background-image", "url(../images/layout/slotCombat.png)");
            $("#combatItem-" + (counter + 1)).css("opacity", ".5");
            $("#combatItem-" + (counter + 1)).css("cursor", "Default");
            $("#combatItem-" + (counter + 1)).data("id", "-1");
            $("#combatItem-" + (counter + 1)).attr("data-script", "An empty item slot, Combat items can be put here.");
        }
        skillIndex = init_eSkills[counter];
        if (skillIndex != -1) {
            $("#combatSkill-" + (counter + 1)).css("background-image", "url(../images/skills/" + skillList[skillIndex - 1].split("|")[2] + ".png)");
            $("#combatSkill-" + (counter + 1)).addClass("combatIcons");
            $("#combatSkill-" + (counter + 1)).addClass("combatActiveSkill");
            $("#combatSkill-" + (counter + 1)).attr("data-id", skillIndex);
            $("#combatSkill-" + (counter + 1)).css("opacity", "");
            skillLevel = 1;
            if (typeof init_skills != "undefined" && init_skills != null && init_skills.length > 0) {
                for (var i = 0; i < init_skills.length; i++) {

                    if (init_skills[i].split("|")[0] == skillIndex) {
                        skillLevel = init_skills[i].split("|")[1];
                    }
                }
            }
            skillLevels.forEach(function(entry) {
                if (entry.split('|')[1] == "skill-" + skillIndex && entry.split('|')[5] == "level-" + skillLevel) {
                    script = entry.split("|")[4]
                    $("#combatSkill-" + (counter + 1)).attr("data-cost", entry.split("|")[3])
                    $("#combatSkill-" + (counter + 1)).attr("data-script", script)
                    if ($("#combatSkill-" + (counter + 1)).attr("data-cost") != "" && $("#combatSkill-" + (counter + 1)).attr("data-cost") <= parseInt(init_statusBar[1].split("/")[0].replace(",", "")) && $("#combatSkill-" + (counter + 1)).attr("data-ID") != 22 &&
                        $("#combatSkill-" + (counter + 1)).attr("data-ID") != 29 &&
                        $("#combatSkill-" + (counter + 1)).attr("data-ID") != 30 &&
                        $("#combatSkill-" + (counter + 1)).attr("data-ID") != 31 &&
                        $("#combatSkill-" + (counter + 1)).attr("data-ID") != 32) {
                    } else {
                        $("#combatSkill-" + (counter + 1)).addClass("disabledButton");
                    }
                }
            });
        } else {
            $("#combatSkill-" + (counter + 1)).removeClass("combatIcons");
            $("#combatSkill-" + (counter + 1)).removeClass("combatActiveSkill");
            $("#combatSkill-" + (counter + 1)).css("background-image", "url(../images/ui-buttons/emptySpell.png)");
            $("#combatSkill-" + (counter + 1)).css("opacity", ".5");
            $("#combatSkill-" + (counter + 1)).css("cursor", "Default");
            $("#combatSkill-" + (counter + 1)).attr("data-id", "-1");
            $("#combatSkill-" + (counter + 1)).attr("data-script", "An empty skill slot, Combat skills can be put here.");
        }
        counter++;
    }

    $('.combatButton').each(function(index) {
        if(status == 1){
            if($(this).hasClass("items") || $(this).hasClass("skillContainer")){
                $(this).addClass("disabledButton");
            }
        }else{
            if ($(this).hasClass("items")) {
                if ($(this).html() != "0" && $(this).html() != "") {
                    $(this).removeClass("disabledButton");
                }else if ($(this).html() == "0"){
                    $(this).addClass("disabledButton");
                }
            } else if ($(this).hasClass("skillContainer")) {

                if ($(this).attr("data-cost") != "" && $(this).attr("data-cost") <= parseInt(init_statusBar[1].split("/")[0].replace(",", "")) && $(this).attr("data-ID") != 22 &&
                    $(this).attr("data-ID") != 29 &&
                    $(this).attr("data-ID") != 30 &&
                    $(this).attr("data-ID") != 31 &&
                    $(this).attr("data-ID") != 32) {
                    $(this).removeClass("disabledButton");
                } else {
                    $(this).addClass("disabledButton");
                }
            } else {
                $(this).removeClass("disabledButton");
            }
        }
    });
    if($(log).length > 0){
        $('#combatTextTable').html("<tr></tr>");
        counter = 0
        while (counter < $(log).length) {
            tokens = log[counter].split("|");
            row = '<tr><td style="text-align:center;width:10%;color:' + tokens[0] + '">' + tokens[1] + '</td><td style="width:80%;text-align:' + tokens[2] + ';">' + tokens[3] + '</td><td style="text-align:center;width:10%;color:' + tokens[4] + '">' + tokens[5] + '</tr>'
            $('#combatTextTable tr:last').after(row);
            counter++;
        }
    }
}

function unloadCombat(message) {
    //  --------------------------------------------------------------------------------------------------
    //                Switches from combat to map, if game isn't started, init game
    //  --------------------------------------------------------------------------------------------------
    enableMenu();
    $('.shiftingColor').removeClass('borderRed', 500).addClass('borderOJ', 500);
    $('#main-combatContainer').fadeOut(300);
    $('#main-combatContainer').addClass('hiddenMap');
    $('#main-mapContainer').removeClass('hiddenMap');
    $('#main-mapContainer').fadeIn(50);
    if (game === undefined) {
        ajaxCall("text", "getLocation");
    }
    ajaxCall("text", "getInventoryJSON");
    ajaxCall("json", "getEquipment");
    ajaxCall("json", "getEnemyList");
    sync_char();
}

function populateMessage(mess) {
    //  --------------------------------------------------------------------------------------------------
    //        Populates the inventory with a message when item used, reloads if telestone used
    //  --------------------------------------------------------------------------------------------------
    if (mess != "telestone") {
        $('#invHeader').html(mess);
        $("#invHeader").show().delay(2000).fadeOut('slow');

    } else {
        location.reload();
    }
}

function clearHeader() {
    //  --------------------------------------------------------------------------------------------------
    //                        Clears the information div on the inventory tab
    //  --------------------------------------------------------------------------------------------------
    $('#invHeader').html('');
}

function reFilter() {
    //  --------------------------------------------------------------------------------------------------
    //                              Filters shop items based on item type
    //  --------------------------------------------------------------------------------------------------
    $("table").each(function(index) {
        if ($(this).hasClass('Selling')) {
            $(this).hide();
            if (!$('#filterMisc').hasClass('clickedFilter') && !$('#filterUsable').hasClass('clickedFilter') && !$('#filterEquip').hasClass('clickedFilter') && !$('#filterCombat').hasClass('clickedFilter')) {
                $(this).show();
            } else {
                if ($('#filterUsable').hasClass('clickedFilter')) {
                    if ($(this).hasClass('Usable')) {
                        $(this).show();
                    }
                }
                if ($('#filterMisc').hasClass('clickedFilter')) {
                    if ($(this).hasClass('Misc')) {
                        $(this).show();
                    }
                }
                if ($('#filterEquip').hasClass('clickedFilter')) {
                    if ($(this).hasClass('Equipment')) {
                        $(this).show();
                    }
                }
                if ($('#filterCombat').hasClass('clickedFilter')) {
                    if ($(this).hasClass('Combat')) {
                        $(this).show();
                    }
                }
            }
        }
    });
    calcSaleTotal();
}

function reFilterEquips() {
    //  --------------------------------------------------------------------------------------------------
    //                              Filters inventory equipment based on headers
    //  --------------------------------------------------------------------------------------------------
    flag = false;
    $('.filterButtons').each(function(index) {
        if ($(this).hasClass("upOne") == true) {
            flag = true;
        }
    });
    if (flag == false) {
        $(".itemTable").show()
    } else {
        $(".itemTable").each(function(index) {
            attr = $(this).attr("data-class");
            if ($('#filter' + attr).hasClass('upOne') == true) {
                $(this).show();
            } else if (attr == '2hweapon' && $('#filterweapon').hasClass('upOne') == true){
                $(this).show();
            }else{
                $(this).hide();
            }
        });
    }
}

function reFilterStashEquips() {
    //  --------------------------------------------------------------------------------------------------
    //                              Filters inventory equipment based on headers
    //  --------------------------------------------------------------------------------------------------

    if (filterStashVar == 3) {
        $('.stashTableEquips').show();
        $('.stashFilters').show();
        flag = false;
        $('.filterStashButtons').each(function(index) {
            if ($(this).hasClass("upOne") == true) {
                flag = true;
            }
        });
        if (flag == false) {
            $(".stashTableEquips").show()
        } else {
            $(".stashTableEquips").each(function(index) {
                attr = $(this).attr("data-class");
                if ($('#filterStash' + attr).hasClass('upOne') == true) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        }
        $('.stashTableItems').hide();
    } else {
        $('table[ID^="item-"]').each(function(index) {
            $('.stashFilters').hide();
            type = $(this).attr('data-type');
            if (filterStashVar != 4) {
                if (type.split('|')[filterStashVar] == 1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            } else {
                if (type.search("1") == -1) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            }
        });
        $('.stashTableEquips').hide();
    }
    $('div[id^="stashTab-"]').each(function(index) {
        $(this).removeClass("clickedShop");
        if ($(this).attr("id") == 'stashTab-' + filterStashVar) {
            $(this).addClass("clickedShop");
        }
    });
}

function reFilterShopEquips() {
    //  --------------------------------------------------------------------------------------------------
    //                          Filters shop-selling equipment based on headers
    //  --------------------------------------------------------------------------------------------------
    flag = false;
    $('.filterShopButtons').each(function(index) {
        if ($(this).hasClass("upOne") == true) {
            flag = true;
        }
    });
    if (flag == false) {
        $(".forSale").show()
    } else {
        $(".forSale").each(function(index) {
            attr = $(this).attr("data-class");
            if ($('#filtershop' + attr).hasClass('upOne') == true) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });
    }
}

function calcSaleTotal() {
    var gTotal = 0;
    $('span[id^="itemSellCount_"]').each(function(index) {
        if ($(this).is(":visible")) {
            var id = $(this).attr('id').slice(14);
            var amnt = $(this).html();
            var price = $('#itemSellImage' + id).attr('data-value');
            var max = $('#itemSellImage' + id).html();
            $('#itemSellTotal_' + id).html(formatNumber(amnt * price));
            gTotal = gTotal + (amnt * price);
            if (max < amnt - -1) {
                $("#supArrow_" + id).addClass("greyArrow");
                $("#supArrow_" + id).removeClass("arrow");
            } else {
                $("#supArrow_" + id).removeClass("greyArrow");
                $("#supArrow_" + id).addClass("arrow");
            }
            if (amnt == 0) {
                $("#sdownArrow_" + id).addClass("greyArrow");
                $("#sdownArrow_" + id).removeClass("arrow");
            } else {
                $("#sdownArrow_" + id).removeClass("greyArrow");
                $("#sdownArrow_" + id).addClass("arrow");
            }
        }
    });
    if (gTotal > 0) {
        $("#sell").removeClass("disabledButton");
    } else {
        $("#sell").addClass("disabledButton");
    }
    $('#sellTotal').html(formatNumber(gTotal));
}

function calcTotal() {
    var gTotal = 0;
    $('span[id^="itemBuyCount_"]').each(function(index) {
        var id = $(this).attr('id').slice(13);
        var amnt = $(this).html();
        var price = $('#itemBuyImage' + id).attr('data-price');
        var total = (amnt * price);
        gTotal = gTotal + (amnt * price);
        $('#itemTotal_' + id).html(formatNumber(total));
    });
    $('span[id^="itemBuyCount_"]').each(function(index) {
        var id = $(this).attr('id').slice(13);
        var price = $('#itemBuyImage' + id).attr('data-price');
        var amnt = $(this).html();
        if (+gTotal + +price > +currency) {
            $("#upArrow_" + id).addClass("greyArrow");
            $("#upArrow_" + id).removeClass("arrow");
        } else {
            $("#upArrow_" + id).removeClass("greyArrow");
            $("#upArrow_" + id).addClass("arrow");
        }
        if (amnt == 0) {
            $("#downArrow_" + id).addClass("greyArrow");
            $("#downArrow_" + id).removeClass("arrow");
        } else {
            $("#downArrow_" + id).removeClass("greyArrow");
            $("#downArrow_" + id).addClass("arrow");
        }
    });
    if (gTotal > 0) {
        $("#buy").removeClass("disabledButton");
    } else {
        $("#buy").addClass("disabledButton");
    }
    $('#total').html(formatNumber(gTotal));
}

function calcEquipTotal() {
    var gTotal = 0;
    $('div[id^="equipBuyImage"].clickedImage').each(function(index) {
        var id = $(this).attr('id').split('_')[1];
        var price = $('#equipItemCost_' + id).html();
        gTotal = +gTotal + +price;
    });
    $('#equipTotal').html(formatNumber(gTotal));
    if (currency < gTotal || gTotal == 0) {
        $('#equipBuy').addClass("disabledButton");
        if (currency < gTotal) {
            $('#equipTotalSpan').css("color", "red")
        } else {
            $('#equipTotalSpan').css("color", "#fcfcfc")
        }
    } else {
        $('#equipBuy').removeClass("disabledButton");
        $('#equipTotalSpan').css("color", "#fcfcfc")
    }
}

function calcEquipSaleTotal() {
    var gTotal = 0;
    $('div[id^="equipSellImage"].clickedImage2:visible').each(function(index) {
        var id = $(this).attr('id').split('_')[1];
        var price = $(this).attr('data-price');
        gTotal = +gTotal + +price;
    });
    $('#equipSellTotal').html(formatNumber(gTotal));
    if (gTotal > 0) {
        $("#equipSell").removeClass("disabledButton");
    } else {
        $("#equipSell").addClass("disabledButton");
    }
}

function movePlayer() {
    if (shopExitX != "empty") {
        player.body.static = true;
        player.y = parseInt(shopExitY);
        player.body.y = parseInt(shopExitY);
        player.x = parseInt(shopExitX);
        player.body.x = parseInt(shopExitX);
        player.body.static = false;
    }
    shopExitX = 'empty';
    showDiv('main-mapContainer');
    $('#mapBtn').addClass("selected");
}

function buildShop(info) {
    $('#clickBuy').addClass('clickedShop');
    $('#clickSell').removeClass('clickedShop');
    currency = parseInt(($('#divCurrency').html().slice(8)).replace(/\,/g,''));
    $("div[ID^='filter']").each(function() {
        $(this).removeClass("clickedFilter");
    });
    $('#shopTitle').html(info.shopName);
    if (buy) {
        $('.sellTabs').hide();
        $('.buyTabs').show();
        $('#sellList').hide();
        $('#buyList').show();
    } else {
        $('.sellTabs').show();
        $('.buyTabs').hide();
        $('#sellList').show();
        $('#buyList').hide();
    }
    counter = 0;
    block = '<table style="margin:0 auto">';


    $.each(info.items,function(i,item){
        itemAmnt = 0
        try{
            itemAmnt = getInventoryJSONRecord(item.itemID).count;
        }catch (err){

        }
        type = '';
        if(item.usable == 1){
            type += 'Non-Combat/';
        }
        if(item.combat == 1){
            type += 'Combat/';
        }
        type = type.substring(0, type.length - 1);

        block += '<tr style="margin:10px;"><td rowspan="2" style="width:60px;">';
        block += '<div id="itemBuyImage' + item.itemID + '"';
        block += 'data-script="' + item.description + '" data-price="' + item.value + '" data-index="' + item.itemID + '" class="shopItems items" ';
        block += 'style="background-image:url(../images/items/' + item.image + '.png)";>';
        block += itemAmnt;
        block += '</div></td>';
        block += '<td rowspan="2" style="font-size:14px;padding-right: 20px;">';
        block += item.name;
        block += '</td><td rowspan="2">';
        block += "Type: " + type;
        block += '</td><td><div id="upArrow_' + item.itemID + '" class="upArrow arrow" data-index="' + item.itemID + '"></div></td>';
        block += '<td rowspan="2" style="font-size:16px;padding-left: 5px;text-align:right; width:170px;">';
        block += '<span id=itemBuyCount_' + item.itemID + '>0</span>ea X ';
        block += '<span id=itemvalue_' + item.itemID + '>' + formatNumber(item.value) + '</span>&#438 = ';
        block += '<span id=itemTotal_' + item.itemID + '>0</span>&#438</td>';
        block += '<tr><td><div id="downArrow_' + item.itemID + '" data-index="' + item.itemID + '" class="downArrow arrow"></div></td>';
        block += '</tr></tr>';
        if (i != info.items.length) {
            block += '<tr><td colspan="6"><div style="width:650px; height:4px; background-image:url(../images/layout/spanner.png)"/></td></tr>';
        } else {
            block += '</table>';
        }
    });

    counter = 0;
    $('#buyList').html(block);
    block = '';

    $.each(inventoryJSON,function(i,item){
        if(item.count > 0 && item.equipment == 0 && item.quest == 0 && item.visible == 1){
            type = '';
            if (item.usable == 1) {
                type += 'Usable ';
            }
            if (item.combat == 1) {
                type += 'Combat ';
            }
            if (type == '') {
                type += 'Misc';
            }
            block += '<table style="display: inline-block; width:385px; padding-left: 20px;" class="Selling ' + type + '"><tr style="margin:10px;" ><td rowspan="2" style="width:60px;">';
            block += '<div id="itemSellImage' + item.itemID + '"';
            block += 'data-script="' + item.description + '" data-value="' + Math.floor(item.value / 3) + '" data-index="' + item.itemID + '" class="shopItems items" ';
            block += 'style="background-image:url(../images/items/' + item.image + '.png)";>' + item.count;
            block += '</div></td><td style="width:160px;">' + item.name + '</td>';
            block += '<td><div id="supArrow_' + item.itemID + '" class="upArrow arrow" data-index="' + item.itemID + '"></div></td>';
            block += '<td rowspan="2" style="font-size:12px;padding-left: 5px;text-align:right; width:124px;">';
            block += '<span id=itemSellCount_' + item.itemID + '>0</span>ea X ';
            block += '<span id=itemSellvalue_' + item.itemID + '>' + formatNumber(Math.floor(item.value / 3)) + '</span>&#438 = ';
            block += '<span id=itemSellTotal_' + item.itemID + '>0</span>&#438</td>';
            block += '</tr><tr><td style="width:160px;">Resell Value: <span id="sellValue_' + item.itemID + '">' + formatNumber(Math.floor(item.value / 3)) + '</span>&#438</td>';
            block += '<td><div id="sdownArrow_' + item.itemID + '" data-index="' + item.itemID + '" class="downArrow arrow"></div></td></tr>';
            block += '</tr></table>';
        }
    });

    $('#sellList').html(block);
    $("#shopWrapper").show();
    $('#shopLoading').hide();
    $("#closeShop").removeClass("disabledButton");
    $("#clickBuy").removeClass("disabledButton");
    $("#clickSell").removeClass("disabledButton");
    $("#buy").removeClass("disabledButton");
    $("#sell").removeClass("disabledButton");
    calcTotal();
    calcSaleTotal();
    if (temp == "sell") {
        $("#clickSell").trigger("click");
        temp = 0;
    }
    $('#messageSlot').html(message).show().delay(2000).fadeOut('fast');
    message = '';
}

function buildEquipShop() {
    $('#clickEquipBuy').addClass('clickedShop');
    $('#clickEquipSell').removeClass('clickedShop');
    currency = $('#divCurrency').html().slice(8);
    $("div[ID^='filter']").each(function() {
        $(this).removeClass("clickedFilter");
    });
    $('#equipmentShopTitle').html(shopInfo[10]);
    if (buy) {
        $('.sellTabs').hide();
        $('.buyTabs').show();
        $('#sellEquipList').hide();
        $('#buyEquipList').show();
    } else {
        $('.sellTabs').show();
        $('.buyTabs').hide();
        $('#sellEquipList').show();
        $('#buyEquipList').hide();
    }
    counter = 0;
    block = '';
    while (counter != 10) {
        if (shopInfo[counter] != -1) {
            item = shopInfo[counter];
            type = item.split('|')[3];
            block += '<table style="display: inline-block; width:385px; padding-left: 20px;" class="buying"><tr style="margin:10px;">';
            block += '<tr style="margin:10px;"><td style="width:60px;">';
            block += '<div id="equipBuyImage_' + item.split('|')[0] + '"';
            block += 'data-script="' + item.split('|')[4] + '" data-price="' + item.split('|')[5] + '" data-index="' + item.split('|')[0] + '" class="equipmentShopItems" ';
            block += 'style="background-image:url(../images/items/' + item.split('|')[2] + '.png)";>';
            block += '</div></td>';
            block += '<td style="font-size:14px;padding-right: 20px;width:140px;">';
            block += item.split('|')[1];
            block += '</td><td style="font-size:14px;width:100px">';
            block += "Type: " + type;
            block += '<td style="font-size:14px;padding-left: 5px;text-align:right; width:60px;">';
            block += '<span id=equipItemCost_' + item.split('|')[0] + '>' + item.split('|')[5] + '</span>&#438';
            block += '</tr>';
            block += '</table>';
        }
        counter++;
    }
    counter = 0;
    $('#buyEquipList').html(block);
    block = '';
    while (counter != init_equipment.length) {
        counter++;
        item = init_equipment[counter - 1];
        if (item.split('|')[7] != 1 && item.split('|')[8] != 1) {
            block += '<table style="display: inline-block; width:385px; padding-left: 20px;" class="forSale" data-class="' + item.split('|')[3] + '">';
            block += '<tr style="margin:10px;"><td rowspan="2" style="width:60px;">';
            block += '<div id="equipSellImage_' + item.split('|')[0] + '"';
            block += 'data-script="' + item.split('|')[4].split('"').join("'") + '" data-price="' + item.split('|')[6] + '" data-index="' + item.split('|')[0] + '" class="equipmentShopItems" ';
            block += 'style="background-image:url(../images/items/' + item.split('|')[2] + '.png)";>';
            block += '</div></td>';
            block += '<td style="font-size:14px;padding-right: 20px;width:240px;">';
            if (item.split('|')[5].length == 1) {
                block += item.split('|')[1];
            } else {
                block += "<span style='font-size: 14px; color:gold;'>" + item.split('|')[1] + "</span>";
            }
            block += '</td></tr><tr>'
            block += '<td style="font-size:14px;padding-left: 5px;text-align:left; width:60px;">';
            block += '<strong><span id=equipItemCost_' + item.split('|')[0] + '>' + item.split('|')[6] + '</span>&#438</strong>';
            block += '</tr>';
            block += '</table>';
        }
    }
    $('#sellEquipList').html(block);
    $("#equipShopWrapper").show();
    $('#equipShopLoading').hide();
    $("#closeEquipmentShop").removeClass("disabledButton");
    $("#clickEquipBuy").removeClass("disabledButton");
    $("#clickEquipSell").removeClass("disabledButton");
    $("#equipBuy").removeClass("disabledButton");
    $("#equipSell").removeClass("disabledButton");
    calcEquipTotal();
    calcEquipSaleTotal();
    if (temp == "sell") {
        $("#clickEquipSell").trigger("click");
        temp = 0;
    }
    $('#equipMessageSlot').html(message).show().delay(2000).fadeOut('fast');
    message = '';
}

function populateBestiry() {
    counter = 0;
    block = '';
    $('#zoneFilter').html($('<option>', {
        value: "All Zones",
        text: "All Zones"
    }));
    $('#mapFilter').html($('<option>', {
        value: "All Maps",
        text: "All Maps"
    }));
    $('#chapterFilter').html($('<option>', {
        value: "All Chapters",
        text: "All Chapters"
    }));
    if (init_enemyList != null) {
        while (counter != init_enemyList.length) {
            enemy = init_enemyList[counter];
            counter++;
            zone = enemy.split('|')[5];
            maps = enemy.split('|')[4];
            chapter = enemy.split('|')[3];

            if ($("#zoneFilter option[value='" + zone + "']").length === 0 && zone != '') {
                $('#zoneFilter').append($('<option>', {
                    value: zone,
                    text: zone
                }));
            }
            if ($("#mapFilter option[value='" + maps + "']").length === 0 && maps != '') {
                $('#mapFilter').append($('<option>', {
                    value: maps,
                    text: maps
                }));
            }
            if ($("#chapterFilter option[value='" + chapter + "']").length === 0 && chapter != '') {
                $('#chapterFilter').append($('<option>', {
                    value: chapter,
                    text: chapter
                }));
            }
            block += "<div class='bestiry' data-chapter='" + chapter + "' data-map='" + map + "' data-zone='" + zone + "' id='card-" + enemy.split('|')[1] + "' data-monID='" + enemy.split('|')[1] + "' data-script='" + enemy.split('|')[6] + "' style='background-image:url(../images/portrits/" + enemy.split('|')[2] + ".png); background-Color:" + enemy.split('|')[8] + "'></div>"
        }
        $('#besMonsters').html(block);
        hideExtraCards();
    }
}

function hideExtraCards() {
    var monsters = [];
    $('.bestiry').each(function(index) {
        id = $(this).attr("data-monid");
        if (monsters.indexOf(id) == -1) {
            monsters.push(id);
        } else {
            $(this).hide();
        }
    });
}

function saveMessage(mess) {
    x = mess.split('~');
    message = x[0];
    $('#divCurrency').html("Silver: " + formatNumber(x[1]))
    init_char[4] = x[1];
    ajaxCall("json", "getShopInfo", shop);
}

function equipSaveMessage(mess) {
    x = mess.split('~');
    message = x[0];
    $('#divCurrency').html("Silver: " + formatNumber(x[1]));
    init_char[4] = x[1];
    init_equipment = JSON.parse(x[2]);
    init_equipmentJSON = setInitEquipmentJSON(JSON.parse(x[2]));
    populateInv();
    populateStash();
    reFilterEquips();
    ajaxCall("json", "getEquipShopInfo", shop);
}

function disableMenu() {
    $('#mapBtn').addClass("disabledButton");
    $('#charBtn').addClass("disabledButton");
    $('#skillBtn').addClass("disabledButton");
	$('#craftBtn').addClass("disabledButton");
    $('#invBtn').addClass("disabledButton");
    $('#besBtn').addClass("disabledButton");
    $('#achBtn').addClass("disabledButton");
    $('#wallBtn').addClass("disabledButton");
    $('#questBtn').addClass("disabledButton");
    $('#suggestionBtn').addClass("disabledButton");
}

function enableMenu() {
    $('#mapBtn').removeClass("disabledButton");
    $('#charBtn').removeClass("disabledButton");
    $('#skillBtn').removeClass("disabledButton");
	$('#craftBtn').removeClass("disabledButton");
    $('#invBtn').removeClass("disabledButton");
    $('#besBtn').removeClass("disabledButton");
    $('#achBtn').removeClass("disabledButton");
    $('#wallBtn').removeClass("disabledButton");
    $('#questBtn').removeClass("disabledButton");
    $('#suggestionBtn').removeClass("disabledButton");
}

function generateSkillTree() {
    var template = init_skillTree

    counter = 0
    $('.placeholder').each(function() {
        if (template.split(",")[counter]) {
            if (template.split(",")[counter].split("|")[1] == 'h') { //Empty header/footer
                $(this).addClass("skillTreeBar");
            } else if (template.split(",")[counter].split("|")[1] == 's') { //skill
                $(this).removeClass("openSkill");
                $(this).removeClass("unlockedSkill");
                skillIndex = template.split(",")[counter].split("|")[0]
                $(this).attr("id", "skillTreeImage-" + skillIndex);
                $(this).addClass('skillTreeSkill');
                $(this).attr("data-skillID", skillIndex);
                $(this).css("background-image", "url(../images/skills/" + skillList[skillIndex - 1].split("|")[2] + ".png)");
                $(this).attr("data-reqLevel", skillList[skillIndex - 1].split("|")[4]);
                $(this).attr("data-parent", skillList[skillIndex - 1].split("|")[3]);
                $(this).attr("data-parentB", skillList[skillIndex - 1].split("|")[7]);
                $(this).attr("data-parentC", skillList[skillIndex - 1].split("|")[8]);
                $(this).attr("data-script", "");
                type = skillList[skillIndex - 1].split("|")[6];
                $(this).attr("data-type", type);
                $(this).html("<div data-max='" + skillList[skillIndex - 1].split("|")[5] + "' data-current=0 data-allocated=0 id='skillLevel-" + skillIndex + "' class='skillTreePoints'></div>");
                $("#skillLevel-" + skillIndex).css("background-image", "url(../images/skills/dots/skillDots-" + skillList[skillIndex - 1].split("|")[5] + ".png)");
            } else if (template.split(",")[counter].split("|")[1] == 'e') { //empty
                $(this).addClass("skillTreeBlock");
                $(this).css("width", template.split(",")[counter].split("|")[0]);
            } else if (template.split(",")[counter].split("|")[1] == 'd') { //down
                $(this).removeClass("activeArrow");
                $(this).addClass("skillTreeDown");
                $(this).addClass("skillTreeArrow");
                $(this).attr("data-parent", template.split(",")[counter].split("|")[0]);
            } else if (template.split(",")[counter].split("|")[1] == 'l') { //left
                $(this).removeClass("activeArrow");
                $(this).addClass("skillTreeLeft");
                $(this).addClass("skillTreeArrow");
                $(this).attr("data-parent", template.split(",")[counter].split("|")[0]);
            } else if (template.split(",")[counter].split("|")[1] == 'r') { //right
                $(this).removeClass("activeArrow");
                $(this).addClass("skillTreeRight");
                $(this).addClass("skillTreeArrow");
                $(this).attr("data-parent", template.split(",")[counter].split("|")[0]);
            } else if (template.split(",")[counter].split("|")[1] == '[') { //hardright
                $(this).removeClass("activeArrow");
                $(this).addClass("skillTreeSideRight");
                $(this).addClass("skillTreeArrow");
                $(this).attr("data-parent", template.split(",")[counter].split("|")[0]);
            } else if (template.split(",")[counter].split("|")[1] == ']') { //hardleft
                $(this).removeClass("activeArrow");
                $(this).addClass("skillTreeSideLeft");
                $(this).addClass("skillTreeArrow");
                $(this).attr("data-parent", template.split(",")[counter].split("|")[0]);
            }
        }
        counter++;
    });


    equipText = '';
    $(init_skills).each(function(index, value) {
        skillIndex = value.split("|")[0];
        skillLevel = value.split("|")[1];
        skillType = skillList[skillIndex - 1].split("|")[6];
        skillName = skillList[skillIndex - 1].split("|")[1];
        skillImage = skillList[skillIndex - 1].split("|")[2];
        if (skillType == 1 || skillType == 3 || skillType == 6) {
            equipText = equipText + "<table style='width:250px;display:inline-block'><tr><td style='height: 52px;width: 52px;'><div class='skill equippableSkill' data-skillID='";
            equipText = equipText + skillIndex + "' style='background-image:url(../images/skills/" + skillImage + ".png)'></div></td>";
            equipText = equipText + "<td style='padding-left:15px;font-size:18px;'>Level " + skillLevel + " " + skillName + "</td></tr></table>"
        }
    });
    if (equipText == "") {
        equipText = equipText + "No Equippable Skills Currently Avalible";
    }
    equipText = equipText + "</table>";
    $("#equippableSkillList").html(equipText);



    useText = '';
    currentMana = init_statusBar[1].split('/')[0]
    $(init_skills).each(function(index, value) {
        skillIndex = value.split("|")[0];
        skillLevel = value.split("|")[1];
        skillType = skillList[skillIndex - 1].split("|")[6];
        skillName = skillList[skillIndex - 1].split("|")[1];
        skillImage = skillList[skillIndex - 1].split("|")[2];

        if (skillType == 2 || skillType == 3 || skillType == 4) {

            class1 = '';
            class5 = '';
            class25 = '';
            manaCost = 0;
            skillLevels.forEach(function(entry) {
                if (entry.split('|')[1] == "skill-" + skillIndex && entry.split('|')[5] == "level-" + skillLevel) {
                    manaCost = entry.split("|")[3]
                    script = entry.split("|")[4]
                }
            });

            if (parseInt(currentMana.replace(',', '')) >= parseInt(manaCost)) {
                class1 = 'multiUseSkill';
            } else {
                class1 = 'notEnoughMana';
            }

            if (parseInt(currentMana.replace(',', '')) >= parseInt(manaCost) * 5) {
                class5 = 'multiUseSkill';
            } else {
                class5 = 'notEnoughMana';
            }

            if (parseInt(currentMana.replace(',', '')) >= parseInt(manaCost) * 25) {
                class25 = 'multiUseSkill';
            } else {
                class25 = 'notEnoughMana';
            }

            useText = useText + "<table style=\"width:450px;display:inline-block\"><tr><td style=\"height: 52px;width: 52px;\"><div class=\"skill\" data-skillID=\"";
            useText = useText + skillIndex + "\" data-script=\"" + script + "\" style=\"background-image:url(../images/skills/" + skillImage + ".png)\"></div></td>";
            useText = useText + "<td style=\"padding-left:15px;font-size:18px;width:250px\">Level " + skillLevel + " " + skillName + "</td>"
            useText = useText + "<td style=\"width:48px;\"><div data-script=\"" + script + "\" class=\"multiUse " + class1 + "\" data-use=\"1\" data-skillID=\"" + skillIndex + "\" style=\"background-image:url(../images/ui-buttons/use1.png)\"></div></td>"
            useText = useText + "<td style=\"width:48px;\"><div data-script=\"" + script + "\" class=\"multiUse " + class5 + "\" data-use=\"5\" data-skillID=\"" + skillIndex + "\" style=\"background-image:url(../images/ui-buttons/use5.png)\"></div></td>"
            useText = useText + "<td style=\"width:48px;\"><div data-script=\"" + script + "\" class=\"multiUse " + class25 + "\" data-use=\"25\" data-skillID=\"" + skillIndex + "\" style=\"background-image:url(../images/ui-buttons/use25.png)\"></div></td>"
            useText = useText + "</tr></table>"




        }
    });
    if (useText == "") {
        useText = "No Usable Skills Currently Avalible";
    }
    $("#useableSkillList").html(useText);




    populateEquippedSkills();
    populateSkillTree();

}

function populateSkillTree() {
    if (typeof init_skills != "undefined" && init_skills != null && init_skills.length > 0) {
        for (var i = 0; i < init_skills.length; i++) {
            skill = init_skills[i].split("|")[0];
            level = init_skills[i].split("|")[1];
            $("#skillLevel-" + skill).attr("data-current", level);
        }
    }
    shiftSkillLevelImages();
}

function populateSkillDescriptions() {
    $('.skillTreePoints').each(function(index) {
        current = $(this).attr("data-current");
        allocated = $(this).attr("data-allocated");
        if (parseInt(current) + parseInt(allocated) == 0) {
            current = 1;
        }
        max = $(this).attr("data-max");
        skillID = $(this).attr("id").split("-")[1];
        skillLevels.forEach(function(entry) {
            if (entry.split('|')[1] == "skill-" + skillID && entry.split('|')[5] == "level-" + (parseInt(current) + parseInt(allocated))) {
                script = entry.split("|")[4]
                $("#skillTreeImage-" + skillID).attr("data-script", script)
            }
        });
    });

    if (clickedSkillUp != '') {
        $(".skillTreeSkill").trigger("mouseleave");
        $("#skillTreeImage-" + clickedSkillUp).trigger("mouseenter");
        clickedSkillUp = ''
    }

}

function shiftSkillLevelImages() {
    empty = false;
    $('.skillTreePoints').each(function(index) {
        max = $(this).attr("data-max");
        current = $(this).attr("data-current");
        allocated = $(this).attr("data-allocated");
        offset = 0;
        if (current != 0 || allocated != 0) {
            offset = offset + (allocated * 6)
            if (max == 10) {
                offset = offset + (current * 66);
            }
            if (max == 5) {
                offset = offset + (current * 36);
            }
            if (max == 3) {
                offset = offset + (current * 24);
            }
            if (max == 1) {
                offset = offset + (current * 6);
            }
        }
        $(this).css("background-position", "0 -" + offset + "px")
        populateSkillDescriptions();
    });
    $('.skillTreeArrow').each(function(index) {
        parent2 = $(this).attr("data-parent");
        if ($("#skillLevel-" + parent2).attr("data-current") > 0 || $("#skillLevel-" + parent2).attr("data-allocated") > 0) {
            $(this).addClass("activeArrow");
        }
    });
    $('.skillTreeSkill').each(function(index) {
        skillID = $(this).attr("data-skillID");
        parent2 = $(this).attr("data-parent");
        parent3 = $(this).attr("data-parentB");
        parent4 = $(this).attr("data-parentC");
        reqLevel = $(this).attr("data-reqLevel");
        max = $("#skillLevel-" + skillID).attr("data-max");
        current = $("#skillLevel-" + skillID).attr("data-current");
        allocated = $("#skillLevel-" + skillID).attr("data-allocated");
        if (allocated > 0) {
            empty = true;
        }
        if (current + allocated > 0) {
            $(this).addClass("openSkill");
        } else if (parent2 > 0) {
            parentCurrent = $("#skillLevel-" + parent2).attr("data-current");
            parentAllocated = $("#skillLevel-" + parent2).attr("data-allocated");
            if (parentCurrent + parentAllocated > 0 && parseInt(init_char[9]) >= parseInt(reqLevel)) {
                if (parent3 > 0) {
                    parentCurrent = $("#skillLevel-" + parent3).attr("data-current");
                    parentAllocated = $("#skillLevel-" + parent3).attr("data-allocated");
                    if (parentCurrent + parentAllocated > 0 && parseInt(init_char[9]) >= parseInt(reqLevel)) {
                        if (parent4 > 0) {
                            parentCurrent = $("#skillLevel-" + parent4).attr("data-current");
                            parentAllocated = $("#skillLevel-" + parent4).attr("data-allocated");
                            if (parentCurrent + parentAllocated > 0 && parseInt(init_char[9]) >= parseInt(reqLevel)) {
                                $(this).addClass("unlockedSkill");
                            }
                        } else {
                            $(this).addClass("unlockedSkill");
                        }
                    }
                } else {
                    $(this).addClass("unlockedSkill");
                }
            }
        } else {
            if (parseInt(init_char[9]) >= parseInt(reqLevel)) {
                $(this).addClass("unlockedSkill");
            }
        }
    });
    if (!empty) {
        $('#skillResetButton').addClass("disabledButton");
        $('#skillConfirmButton').addClass("disabledButton");
        $('#skillResetButton').removeClass("clickedShop");
        $('#skillConfirmButton').removeClass("clickedShop");
    } else {
        $('#skillResetButton').removeClass("disabledButton");
        $('#skillConfirmButton').removeClass("disabledButton");
        $('#skillResetButton').addClass("clickedShop");
        $('#skillConfirmButton').addClass("clickedShop");
    }
}

function buildAchievementPage() {
    var block = '';
    achievementList.forEach(function(entry) {
        block += "<div class='achievement' id='achievement-" + entry.split('|')[0] + "' data-script='" + entry.split('|')[3]
        block += "' style='background-image:url(../images/achievements/" + entry.split('|')[2] + ".png);'></div>"
    });
    $('#achievementDiv').html(block);
}

function setAchievements(data) {
    data.forEach(function(entry) {
        achID = entry.split("|")[0];
        status = entry.split("|")[1];
        script = $('#achievement-' + achID).attr("data-script");
        $('#achievement-' + achID).attr("data-script", script.replace("[complete]", status));
        if (status != "<span style='color:red';><strong>Incomplete</strong></span>") {
            $('#achievement-' + achID).addClass("unlockedAchievement");
        }

    });
}

function populateCompleteQuestRows(data) {
    $('#completeQuests').html("");
    if (data) {
        questLogBuilder = "";
        $("#completeQuestHeader").html("Complete Quests (" + data.length + ")")
        data.forEach(function(entry) {
            questID = entry.split("|")[0];
            repeatable = entry.split("|")[1];
            complete = entry.split("|")[2];
            name = entry.split("|")[3];

            if (repeatable == 1) {
                complete = "Complete x" + complete;
            } else {
                complete = "Complete!"
            }
            questLogBuilder += "<div class='questRow'><span class='questName'>" + name + "</span>"
            questLogBuilder += "<div data-questID='" + questID + "' data-complete='1' class='questDetailsButton'>Details</div><span class='questComplete'>" + complete + "</span></div>"
        });
        $('#completeQuests').html(questLogBuilder);
    }
}

function populateIncompleteQuestRows(data) {
    $('#incompleteQuests').html("");
    if (data) {
        questLogBuilder = "";
        $("#incompleteQuestHeader").html("Quests In Progress (" + data.length + ")")
        data.forEach(function(entry) {
            questID = entry.split("|")[0];
            name = entry.split("|")[1];

            questLogBuilder += "<div class='questRow'><span class='questName'>" + name + "</span>"
            questLogBuilder += "<div data-questID='" + questID + "' data-complete='0' class='questDetailsButton'>Details</div><span class='questWorking'>In Progress! </span></div>"
        });
        $('#incompleteQuests').html(questLogBuilder);
    }else{
        $("#incompleteQuestHeader").html("Quests In Progress")
    }
}

function populateQuestLogDetail(data) {

    $('#questDetailsLoading').hide();
    $('#questDetailsWrapper').show();
    questInfo = (JSON.parse(data));
    $('#questDetailsLeft').attr("data-id", questInfo.questID);
    if (questInfo.status == "working") {
        $('#questDetailsText').html(questInfo.startText);
    }else{
        $('#questDetailsText').html(questInfo.finishText);
    }
    for (i = 1; i < 4; i++) {
        if(questInfo["req-" + i] != 0){
            item = getInventoryJSONRecord(questInfo["req-" + i]);
            $('#reqD' + i + "row").show();
            string = '';
            if (questInfo.status == "working") {
                if(questInfo["amnt-" + i] == item.count){
                    string = '<span style="color:green;"><strong>' + item.count + '/' + item.count + '</strong></span>';
                }else{
                    string = '<span style="color:red;"><strong>' + item.count + '/' + questInfo["amnt-" + i] + '</strong></span>';
                }
            }else{
                string = '<span style="color:green;"><strong>' + questInfo["amnt-" + i] + '/' + questInfo["amnt-" + i] + '</strong></span>'
            }
            $('#reqD' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');

            if(item.visible == 1){
                $('#reqD' + i).html(item.name + " - " + string + " Collected");
            } else {
                $('#reqD' + i).html(item.name + " - " + string + " Slain");
            }
        }else{
            $('#reqD' + i + "row").hide();
        }
    }

    for (i = 1; i < 4; i++) {
        if(questInfo["reward-" + i] != 0){
            item = getInventoryJSONRecord(questInfo["reward-" + i]);
            $('#rewardD' + i + 'row').show();
            $('#rewardD' + i + 'image').css("background-image", "url(../images/items/" + item.image + '.png)');
            $('#rewardD' + i).html(item.name + " - " + questInfo["rAmnt-" + i] + " Rewarded");
        } else {
            $('#rewardD' + i + 'row').hide();
        }
    }

    if (questInfo["expAmnt"] != 0) {
        $('#rewardDErow').show();
        $('#rewardDEimage').css("background-image", "url(../images/items/misc/exp.png)");
        $('#rewardDEXP').html("Experience - " + formatNumber(questInfo["expAmnt"]) + " Rewarded");
    } else {
        $('#rewardDErow').hide();
    }
    if (questInfo["silverAmnt"] != 0) {
        $('#rewardDSrow').show();
        $('#rewardDSimage').css("background-image", "url(../images/items/misc/silver.png)");
        $('#rewardDSilver').html("Silver - " + formatNumber(questInfo["silverAmnt"]) + " Rewarded");
    } else {
        $('#rewardDSrow').hide();
    }
}

function populateTelePage(data, loc) {
    teleBuilder = '';
    saveBuilder = '';
    data.forEach(function(entry) {
        name = entry.split("|")[1];
        cost = entry.split("|")[0];
        disabledClass = "";
        if(parseInt(cost) > init_char[4]){
            disabledClass = "disabledButton";
        }
        if (cost != 0) {
            ID = entry.split("|")[2];
            teleBuilder += "<div class='teleRow'><span class='locName'>" + name + "</span>"
            teleBuilder += "<div data-waypointID='" + ID + "' class='teleButton " + disabledClass + "'>Teleport!</div><span class='teleCost'>" + formatNumber(cost) + " Silver</span></div>"
        } else {
            saveBuilder += "<div class='spawnRow'><strong>Current Location:</strong> " + name + "<br/><span style='color:grey'><strong>Current Spawn Point: </strong><span ID='respawnText'>" + loc + "</span></span>";
            text = "Save Spawn";
            if (loc == name) {
                text = "Spawn Saved";
            }
            saveBuilder += "<div class='setSpawn' id='setRespawn'>" + text + "</div></div>"
            $("#spawnOptions").html(saveBuilder);
            if (loc == name) {
                $(".setSpawn").addClass("savedSpawn");
            } else {
                $(".setSpawn").removeClass("savedSpawn");
            }
        }
    });
    $("#teleOptions").html(teleBuilder);
    $("#teleLoading").hide();
    $("#teleWrapper").show();
}

function toggleFullScreen(elem) {
    // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
    if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
        if (elem.requestFullScreen) {
            elem.requestFullScreen();
        } else if (elem.mozRequestFullScreen) {
            elem.mozRequestFullScreen();
        } else if (elem.webkitRequestFullScreen) {
            elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        } else if (elem.msRequestFullscreen) {
            elem.msRequestFullscreen();
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function addItems() {
    if(kongregate){
        pass = kongregate.services.getUserId();
        token = kongregate.services.getGameAuthToken();
        $.ajax({
            type: "POST",
            dataType: "text",
            data: {
                call: "updateStoreInv",
                userID: pass,
                userToken: token
            },
            url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
            success: function(data) {
                ajaxCall("text", "updateInventory");
            },
        });
    }
}

function addStarterPack() {
    if(kongregate){
        pass = kongregate.services.getUserId();
        token = kongregate.services.getGameAuthToken();
        $.ajax({
            type: "POST",
            dataType: "text",
            data: {
                call: "updateStoreInv",
                userID: pass,
                userToken: token
            },
            url: "https://applesauce-838900413941.us-west1.run.app/kong_AJAX.php",
            success: function(data) {
                ajaxCall("text", "updateInventory");
                ajaxCall("json", "getEquipment");
            },
        });
    }
}

function populateStash() {
    leftString = '';
    rightString = '';

    $.each(init_equipmentJSON, function(index, item){
        itemID = index;
        name = item.name;
        image = item.image;
        slot = item.slot;
        equipped = item.equipped;
        script = item.script1;
        actualScript = item.script2;
        stored = item.stored;
        template = item.template;
        if([51,52,53,54,55,56,57,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74].indexOf(parseInt(template)) > -1){
            name = '<span style="color:#ff6a01">' + name + "</span>"
        }else if([83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104].indexOf(parseInt(template)) > -1){
            name = '<span style="color:#cc00ff">' + name + "</span>"
        }else if (actualScript != "0") {
            name = '<span style="color:gold">' + name + "</span>"
        }
        if (equipped != 1) {
            invString = "<table class='stashTableEquips' id='item-" + itemID + "' data-row='" + itemID + "' style='float:left; width:100%;' data-type='"
            invString = invString + itemType + "' data-class='" + slot + "'><tr><td style='width: 40px;'><div data-script='" + script
            invString = invString + "' data-type='" + itemType + "' data-name='" + name + "' id='stashEquip-" + itemID + "' data-row='" + itemID
            invString = invString + "' class='items' style='background-image:url(../images/items/" + image + ".png)'>"
            invString = invString + "</div></td><td style='font-size: 14px;'>" + name + "</td></tr></table>";
            if (stored == 0) {
                leftString = leftString + invString;
            } else {
                rightString = rightString + invString;
            }
        }
    });

    $(inventoryJSON).each(function(index, item){
        if(item.visible == 1 && item.equipment != "1"){
            itemType = item.usable + '|' + item.combat + '|' + item.quest + '|0';
            if (item.count > 0) {
                invString = "<table class='stashTableItems' id='item-" + item.itemID + "' style='float:left; width:100%;' data-type='"
                invString = invString + itemType + "'><tr><td style='width: 40px;'><div data-script='" + item.description
                invString = invString + "' data-type='" + itemType + "' data-name='" + item.name + "' id='stashItem-" + item.itemID
                invString = invString + "' class='items' style='background-image:url(../images/items/" + item.image + ".png)'>"
                invString = invString + item.count + "</div></td><td style='font-size: 14px;'>" + item.name + "</td></tr></table>";
                leftString = leftString + invString;
            }
            if (item.stored > 0) {
                invString = "<table class='stashTableItems' id='item-" + item.itemID + "' style='float:left; width:100%;' data-type='"
                invString = invString + itemType + "'><tr><td style='width: 40px;'><div data-script='" + item.description
                invString = invString + "' data-type='" + itemType + "' data-name='" + item.name + "' id='stashItem-" + item.itemID
                invString = invString + "' class='items stash' style='background-image:url(../images/items/" + item.image + ".png)'>"
                invString = invString + item.stored + "</div></td><td style='font-size: 14px;'>" + item.name + "</td></tr></table>";
                rightString = rightString + invString;
            }

        }
    })

    $("#stashLeft").html(leftString);
    $("#stashRight").html(rightString);
}

function getDailyQuest() {
    ajaxCall('text', 'getDailyQuest', -1);
    dailyQuest = true;
}
function itemPickerShow(callback){
	$.fancybox({
		model: true,
		href: '#itemSelectPanel',
        beforeShow: function(){
			ajaxCall("text", "getInventoryJSON");
		},
        afterClose : function() {
            if (typeof callback == 'function'){ callback.call(this, ret); }
            ret = -1;
        }
    });
}
function clearCrafting(){
	$("#craftNowBtn").addClass("disabledButton");
	$(".craftingSelector").css("background-image", "url(../images/items/usable/question.png");
	$(".craftingSelector").attr("data-id", "-1");
	$(".craftingSelector").attr("data-uid", "-1");
	$("#itemOutput").css("background-image", "url(../images/items/usable/question.png");
	$("#itemOutputScript").html();
	$("#craftSuccess").html("N/A");
	$("#craftCost").html("N/A");
    $("#craftCost").css("color", "white");
	$("#craftNowBtn").attr("data-recipeID", 0);
	$("#itemOutputScript").html("");
    ajaxCall("text", "getStatus");
}
function updateInventoryJSON(index, field, value){
    $.each(inventoryJSON,function(i,v){
        if (v.itemID == index) {
            v[field] = value;
            return;
        }
    });
}
function getInventoryJSONRecord(index){
    var ret;
    $.each(inventoryJSON,function(i,v){
        if (v.itemID == index){
            ret = v;
            return false;
        }
    });
    return ret;
}
function numberWithCommas(x) {
    try{
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }catch(err){}
}
function setInitEquipmentJSON(equipment){
    arr = {};
    $.each(equipment,function(i,v){
        s = v.split("|");
        equipItem = {};
        equipItem["name"] = s[1];
        equipItem["image"] = s[2];
        equipItem["slot"] = s[3];
        equipItem["script1"] = s[4];
        equipItem["script2"] = s[5];
        equipItem["price"] = s[6];
        equipItem["equipped"] = s[7];
        equipItem["stored"] = s[8];
        equipItem["template"] = s[9];
        arr[s[0]] = equipItem;
        if(s[7] == 1){
            init_equipped_equipmentJSON[s[0]] = equipItem;
        }
    });
    return arr;
}
function buildEndlessPanel(data){
    var floors = [];
    var costs = [];

    floors[11] = 'Eleventh Floor';
    floors[21] = 'Twenty-First Floor';
    floors[31] = 'Thirty-First Floor';
    floors[41] = 'Forty-First Floor';
    floors[51] = 'Fifty-First Floor';
    floors[61] = 'Sixty-First Floor';
    floors[71] = 'Seventy-First Floor';
    floors[81] = 'Eighty-First Floor';
    floors[91] = 'Ninety-First Floor';

    costs[11] = 1;
    costs[21] = 2;
    costs[31] = 4;
    costs[41] = 6;
    costs[51] = 10;
    costs[61] = 14;
    costs[71] = 20;
    costs[81] = 26;
    costs[91] = 34;

    $("#corruptStoneCount").html(data["stones"]);
    maxFloor = parseInt(data["floor"]);
    stones = parseInt(data["stones"]);
    if(maxFloor > 100){
        maxFloor = 100;
    }
    teleBuilder = '';
    cost = 1;
    for (i = 10; i < maxFloor; i++) {
        if(i % 10 == 1){
            teleBuilder += "<div class='teleRow'><span class='locName'>" + floors[i] + "</span>"
            disabledClass = "";
            if(costs[i] > stones){
                disabledClass = "disabledButton";
            }
            if(cost == 1){
                teleBuilder += "<div data-floorID='" + i + "' class='towerTeleButton " + disabledClass + "'>Teleport!</div><span class='teleCost'>" + costs[i] + " Corrupt Stone</span></div>"
            }else{
                teleBuilder += "<div data-floorID='" + i + "' class='towerTeleButton " + disabledClass + "'>Teleport!</div><span class='teleCost'>" + costs[i] + " Corrupt Stones</span></div>"
            }
            cost++;
        }
    }
    $("#corruptTeleOptions").html(teleBuilder);
}







/*
 * jQuery Asynchronous Plugin 1.0 RC1
 *
 * Copyright (c) 2008 Vincent Robert (genezys.net)
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 */
(function($){

// opts.delay : (default 10) delay between async call in ms
// opts.bulk : (default 500) delay during which the loop can continue synchronously without yielding the CPU
// opts.test : (default true) function to test in the while test part
// opts.loop : (default empty) function to call in the while loop part
// opts.end : (default empty) function to call at the end of the while loop
$.whileAsync = function(opts)
{
	var delay = Math.abs(opts.delay) || 10,
		bulk = isNaN(opts.bulk) ? 500 : Math.abs(opts.bulk),
		test = opts.test || function(){ return true; },
		loop = opts.loop || function(){},
		end  = opts.end  || function(){};

	(function(){

		var t = false,
			begin = new Date();

		while( t = test() )
		{
			loop();
			if( bulk === 0 || (new Date() - begin) > bulk )
			{
				break;
			}
		}
		if( t )
		{
			setTimeout(arguments.callee, delay);
		}
		else
		{
			end();
		}

	})();
}

// opts.delay : (default 10) delay between async call in ms
// opts.bulk : (default 500) delay during which the loop can continue synchronously without yielding the CPU
// opts.loop : (default empty) function to call in the each loop part, signature: function(index, value) this = value
// opts.end : (default empty) function to call at the end of the each loop
$.eachAsync = function(array, opts)
{
	var i = 0,
		l = array.length,
		loop = opts.loop || function(){};

	$.whileAsync(
		$.extend(opts, {
			test: function(){ return i < l; },
			loop: function()
			{
				var val = array[i];
				return loop.call(val, i++, val);
			}
		})
	);
}

$.fn.eachAsync = function(opts)
{
	$.eachAsync(this, opts);
	return this;
}

})(jQuery)
