   $.fn.FMPlay  =function(){

       function musicplay() {

            this.createframe();
            this.bg = this.music_window.find('#bg');
            this.tit = this.music_window.find('#main h1');
            this.auth = this.music_window.find('#main h5');
            this.sonlrc = this.music_window.find('#lrc');
            this.currentid = "";
            this.player = this.music_window.find('#musicplay');
            this.play_left = this.music_window.find('.play-left');
            this.play_right = this.music_window.find('.play-right');
            this.pause = this.music_window.find('.pause');
            this.vol_btn = this.music_window.find('#vol-btn');
            this.song_btn = this.music_window.find('#song-btn');
            this.vol_pro = this.music_window.find('#vol-pro');
            this.song_pro = this.music_window.find('#song-pro');
            this.currentpara = {};
            this.lrcobj = [];
            this.audio = document.getElementById('musicplay');
            this.ended = false;
            this.cur_time = this.music_window.find(".cur-time");
            this.full_time = this.music_window.find('.full-time');
            this.downflag = false;
            this.tick = 0;
            this.timeclock = -1;
            this.audioinit = false;
            this.bindEvent();
        }
        musicplay.prototype = {
            createframe: function() {
                this.play_btn = $('<a href="#" class="iconfont" id="music-btn">&#xe794;</a>');
                this.music_window = $('<div id="music-frame"><div id="original"><div class="types"> <div class="typelist"></div> </div><div id="main"><div class="nav"><a href="javascript:void(0)" class="iconfont left">&#xe8f0;</a><a href="javascript:void(0)" class="iconfont right">&#xe62a;</a></div><h1>RADIOACTIVE</h1><h5>Imagine Dragons</h5><div class="play-btns"><audio id="musicplay" src="" width="100" height="100"></audio><div class="iconfont prev"><a href="javascript:void(0)">&#xe64d;</a></div><div class="play"> <span class="play-left"></span><span class="play-right"></span> <span class="pause iconfont">&#xe6b0;</span> </div> <div class="iconfont next"><a href="javascript:void(0)">&#xe601;</a></div></div><div id="lrccon"> <div id="lrc"></div></div> <div class="tips"><a class="iconfont vol" href="javascript:void(0)">&#xe7d8;</a><progress id="vol-pro" value="50" max="100"><ie class="ie"></ie></progress><a id="vol-btn" href="javascript:void(0)"></a><a href="javascript:void(0)" class="iconfont showlrc">&#xe89f;</a></div><div class="playtime"><span class="cur-time">00:00</span><progress id="song-pro" value="0" max="100"><ie class="ie"></ie></progress><a id="song-btn" href="javascript:void(0)"></a><span class="full-time">00:00</span></div><div id="bg"></div></div></div></div>');
                $('body').append(this.play_btn);
                $('body').append(this.music_window);


            },
            getchanlist: function(obj) {

                var chans = '<ul>';
                this.currentid = obj.channels[0].channel_id;
                for (lrc_item in obj.channels) {
                    // if (lrc_item < 9) {
                    chans += '<li><a href="javascript:void(0)" id="' + obj.channels[lrc_item].channel_id + '">' + obj.channels[lrc_item].name + "</a></li>";
                    //  }
                }
                chans += '</ul>';
                return chans;

            },


            /*  function getsong(id) {
                  $("cur-time").html("00:00");
                  tick = 0;
                  url = "http://api.jirengu.com/fm/getSong.php?channel='" + id + "'&sid='247040'";
                  $.get(url, function(result) {
                      lrcobj = [];
                      currentpara = {};
                      var newsong = JSON.parse(result);
                      tit.html("亲爱的再见亲爱的再见亲爱的再见亲爱的再见");
                      auth.html("戴佩妮");
                      var imgurl = 'url("http://musicdata.baidu.com/data2/pic/88992148/88992148.jpg@s_0,w_300")';
                      bg.css("background-image", imgurl);
                      var content = "http://yinyueshiting.baidu.com/data2/music/124590261/112798171483574461128.mp3?xcode=8c111230b87ca227ed47f60d337fa3fd";
                      var lrc = "http://musicdata.baidu.com/data2/lrc/13767785/13767785.lrc";

                      player.attr("src", content);
                      play_left.show();
                      play_right.show();
                      pause.hide();

                      getlrc(lrc);

                  });

              }*/

            getsong: function(id) {

                this.cur_time.html("00:00");
                this.tick = 0;
                var url = "http://api.jirengu.com/fm/getSong.php?channel='" + id + "'";
                var _this = this;
                $.get(url, function(result) {
                    _this.lrcobj = [];
                    _this.currentpara = {};
                    var newsong = JSON.parse(result);
                    _this.tit.html(newsong.song[0].title);
                    _this.auth.html(newsong.song[0].artist);
                    _this.bg.css("background-image", "url(" + newsong.song[0].picture + ")");
                    _this.player.attr("src", newsong.song[0].url);
                    _this.play_left.show();
                    _this.play_right.show();
                    _this.pause.hide();

                    _this.getlrc(newsong.song[0].lrc);

                });

            },




            getlrc: function(url) {
                var songcon = "";
                var _this = this;
                $.get(url, function(result) {
                    var lrc_content = result.split('\n');
                    var rul = /^\[.+\].+$/;

                    _this.lrcobj = [];

                    for (var lrc_item in lrc_content) {
                        if (lrc_item > 3) {
                            if (rul.test(lrc_content[lrc_item])) {
                                _this.lrcobj.push({
                                    time: lrc_content[lrc_item].substring(1, 8),
                                    con: lrc_content[lrc_item].substring(10)
                                });
                                if (_this.lrcobj.length == 1) {
                                    songcon += "<p class='big'>" + lrc_content[lrc_item].substring(10) + "</p>";
                                } else {
                                    songcon += "<p>" + lrc_content[lrc_item].substring(10) + "</p>";
                                }
                            }
                        }
                    }
                    _this.sonlrc.html(songcon);

                    _this.currentpara = {
                        id: 1,
                        para: _this.lrcobj[1]
                    };



                });

            },

            tick2time: function(sec) {
                var now_min = Math.floor(sec / 60);
                var now_sec = Math.floor(sec % 60);
                var time_now = (now_min >= 10 ? now_min : "0" + now_min) + ":" + (now_sec >= 10 ? now_sec : "0" + now_sec);
                return time_now;
            },

            addtick: function(obj) {
                obj.tick += 1;

                obj.cur_time.html(obj.tick2time(obj.tick));
            },

            audioplay: function(obj) {
                var _this = obj;
                if (_this.downflag == false && _this.lrcobj.length > 0) {


                    if (_this.currentpara.id == 1) {
                        _this.ended == false;
                    }


                    var paratime = _this.currentpara.para.time.split(':');
                    var realtime = paratime[0] * 60 + paratime[1] * 1;

                    var currenttime = Math.floor(_this.audio.currentTime);
                    if (currenttime > realtime && !_this.ended) {

                        _this.sonlrc.animate({
                            top: (-23) * (_this.currentpara.id - 1)
                        }, 500);

                        var tar_p = "p:eq('" + (_this.currentpara.id) + "')";
                        _this.music_window.find(tar_p).addClass('big').siblings().removeClass('big');
                        if (_this.currentpara.id < _this.lrcobj.length - 1) {
                            _this.currentpara.id++;
                            _this.currentpara.para = _this.lrcobj[_this.currentpara.id];
                        } else {
                            _this.ended = true;
                        }

                    }


                    var percent = currenttime / _this.audio.duration * 100;
                    _this.song_btn.css({
                        left: 55 + currenttime / _this.audio.duration * 220
                    });
                    _this.song_pro.val(percent);

                }
            },


            roll: function(obj) {
                var _this = obj;
                _this.audio.addEventListener('timeupdate', function() {
                    _this.audioplay(_this);
                });
                _this.audio.addEventListener('ended', function() {

                    clearInterval(_this.timeclock);

                    _this.getsong(_this.currentid);


                });
                _this.audio.addEventListener('loadedmetadata', function() {
                    _this.ended = false;
                    clearInterval(_this.timeclock);
                    _this.tick = 0;
                    _this.cur_time.html("00:00");


                    _this.full_time.html(_this.tick2time(_this.audio.duration));

                    _this.sonlrc.css("top", "23px");
                    _this.audio.play();


                    _this.timeclock = setInterval(function() {
                        _this.addtick(_this);
                    }, 1000);


                });
            },


            frame_drag: function($dia, $target) {


                var init_x = 0;
                var init_y = 0;
                var dia_top = 0;
                var dia_left = 0;
                var item_height = $dia.outerHeight() / 2;
                var item_width = $dia.outerWidth() / 2;
                var fullheight = $(document).height();
                var fullwidth = $(document).width();
                var _this = this;
                $dia.on('mousedown', function(e) {
                    if (e.target != $target.get(0)) {
                        return;
                    }

                    dia_top = $dia.position().top;
                    dia_left = $dia.position().left;
                    init_x = e.pageX;
                    init_y = e.pageY;

                    _this.downflag = true;
                });
                $dia.on('mousemove', function(e) {
                    if (e.target != $target.get(0)) {
                        return;
                    }
                    if (_this.downflag) {

                        var realheight = dia_top + e.pageY - init_y;
                        var realwidth = dia_left + e.pageX - init_x;

                        //   if (realheight < fullheight - item_height && realheight > item_height)
                        $dia.css({
                            "top": realheight + "px",
                            "cursor": "move"
                        });
                        //    if (realwidth < fullwidth - item_width && realwidth > item_width)
                        $dia.css({

                            "left": realwidth + "px"
                        });
                    }

                });
                $dia.on('mouseup', function(e) {
                    if (e.target != $target.get(0)) {
                        return;
                    }
                    _this.downflag = false;
                    $dia.css({
                        "cursor": "default"
                    });
                });
            },

            press_drag: function($dia, $pro) {

                var _this = this;
                var init_x = 0;
                var init_y = 0;
                var dia_top = 0;
                var dia_left = 0;
                var initwidth = $pro.width();
                var init_left = $pro.position().left;
                var initposition = initwidth - $dia.width();
                var realwidth = 0;
                var persent = 0;

                $dia.on('mousedown', function(e) {


                    dia_left = $dia.position().left;
                    init_x = e.pageX;

                    _this.downflag = true;


                });
                $dia.on('mousemove', function(e) {

                    if (_this.downflag) {

                        if ($dia == _this.song_btn) {
                            clearInterval(_this.timeclock);

                        }
                        realwidth = dia_left + e.pageX - init_x;

                        if (realwidth <= init_left + initposition && realwidth >= init_left) {

                            $dia.css({

                                "left": realwidth + "px"
                            });
                            if (_this.audio !== null) {
                                persent = (realwidth - init_left) / initposition;
                                $pro.val(persent * 100);

                                if ($dia == _this.vol_btn) {
                                    _this.audio.volume = persent;
                                }
                            }
                        }
                    }

                });

                $dia.on('mouseup mouseleave', function() {

                    if (_this.downflag == true) {

                        if ($dia == _this.song_btn && _this.audio.currentTime != Math.floor(persent * _this.audio.duration)) {
                            clearInterval(_this.timeclock);
                            _this.audio.currentTime = Math.floor(persent * _this.audio.duration);
                            _this.tick = Math.floor(persent * _this.audio.duration);
                            $('.cur-time').html(_this.tick2time(_this.tick));

                            var paratime = 0;
                            var realtime = 0;
                            for (var lrc_item in _this.lrcobj) {

                                paratime = _this.lrcobj[lrc_item].time.split(':');
                                realtime = paratime[0] * 60 + paratime[1] * 1;
                                if (_this.audio.currentTime < realtime) {

                                    _this.sonlrc.css({
                                        top: (-23) * (lrc_item - 2)
                                    });
                                    var tar_p = "p:eq('" + (lrc_item - 1) + "')";
                                    $(tar_p).addClass('big').siblings().removeClass('big');

                                    _this.currentpara.id = lrc_item - 1;
                                    _this.currentpara.para = _this.lrcobj[_this.currentpara.id];
                                    if (!_this.audio.paused) {
                                        _this.timeclock = setInterval(function() {
                                            _this.addtick(_this);
                                        }, 1000);
                                    }
                                    break;
                                }

                            }
                        }
                        _this.downflag = false;

                    }

                });
            },
            bindEvent: function() {

                var types = this.music_window.find('.types');
                var main_window = this.music_window.find('#main');
                var nav = this.music_window.find('.nav');
                var _this = this;
                this.play_btn.on('click', function() {
                    var original = _this.music_window.find("#original");
                    if (original.css("display") == "none") {
                        original.show();
                        if (!_this.audioinit) {
                            _this.frame_drag(_this.music_window, nav);
                            _this.press_drag(_this.vol_btn, _this.vol_pro);
                            _this.press_drag(_this.song_btn, _this.song_pro);

                            $.get("http://api.jirengu.com/fm/getChannels.php", function(result) {
                                var channelinfo = JSON.parse(result);
                                if (channelinfo.channels.length > 0) {
                                    var chanlist = _this.getchanlist(channelinfo);
                                    $(".typelist").html(chanlist);
                                    _this.getsong(_this.currentid);
                                    _this.audio.volume = 0.5;
                                } else {
                                    console.log("未获取到数据");
                                    return;
                                }




                            });
                            //_this.roll(_this);
                            _this.audioinit = true;
                        }
                    } else {
                        original.hide();
                    }


                });
                this.roll(this);
                this.music_window.find('.typelist').on('click', 'a', function(e) {
                    var target_id = $(e.target).attr('id');
                    _this.currentid = target_id;
                    _this.getsong(target_id);

                });
                types.on('mouseleave', function() {
                    main_window.animate({
                        marginLeft: "0px"
                    }, 500);
                    types.animate({
                        marginLeft: "0px"
                    }, 500);
                    types.hide(500);

                });
                this.music_window.find('.prev ').on('click', function(e) {

                    _this.getsong(_this.currentid);
                });
                this.music_window.find('.showlrc').on('click', function(e) {

                    _this.sonlrc.toggle();


                });
                this.music_window.find('.vol').on('click', function(e) {

                    _this.vol_pro.toggle();
                    _this.vol_btn.toggle();
                });
                this.music_window.find('.next').on('click', function(e) {

                    _this.getsong(_this.currentid);
                });
                this.music_window.find('.left').on('mouseover', function(e) {


                    if (parseInt(main_window.css("margin-left")) > 0) {


                        main_window.animate({
                            marginLeft: "0px"
                        }, 500);
                        types.animate({
                            marginLeft: "0px"
                        }, 500);
                        types.hide(500);
                    } else {
                        main_window.animate({
                            marginLeft: "110px"
                        }, 500);
                        types.toggle();
                    }

                });
                this.music_window.find('.play ').on('click', function(e) {

                    if (_this.audio !== null) {
                        //检测播放是否已暂停.audio.paused 在播放器播放时返回false.

                        if (_this.audio.paused) {
                            _this.audio.play(); //audio.play();// 这个就是播放  
                            _this.play_left.show();
                            _this.play_right.show();
                            _this.pause.hide();

                            _this.timeclock = setInterval(function() {
                                _this.addtick(_this);
                            }, 1000);

                        } else {
                            _this.audio.pause(); // 这个就是暂停
                            _this.play_left.hide();
                            _this.play_right.hide();
                            _this.pause.show();
                            clearInterval(_this.timeclock);
                        }
                    }
                });
            }
        }
         new musicplay();
}