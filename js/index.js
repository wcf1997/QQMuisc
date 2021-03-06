$(function(){
    // 自定义滚动条
    
    $('.container_list').mCustomScrollbar();
   
    var $audio = $('audio');
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyric;
      // 3. 加载歌曲列表
      getPlayerList()
      function getPlayerList(){
            $.ajax({
                url : "http://localhost:8030/QQ%e9%9f%b3%e4%b9%90%e6%92%ad%e6%94%be%e5%99%a8//music/music.json",
                dataType : "json",
                success : function (data){
                    player.musicList = data;   
                  //  3.1 遍历获取到的数据,创建每一条音乐
                  var $musicList = $(".container_list ul");
                   $.each(data,function(index,ele){
                       var $item = crateMusicItem(index,ele);
                     
                          $musicList.append($item)
                   });
                   //默认显示第0首歌曲信息
                   initMusicInfo(data[0]);
                   initMusicLyric(data[0]);
                },
                error:function (e){
                    console.log(e)
                }
            })
      }
      // 初始化歌曲信息
      function initMusicInfo(music){
          //获取对应元素
          var $musicImage = $('.song_info_pic img');
          var $musicName = $('.song_info_name a');
          var $musicSinge = $('.song_info_singer a');
          var $musicAlbum = $('.song_info_ablum a');
          var $musicProgressName = $('.music_progress_name');
          var $musicProgressTime = $('.music_progress_time');
          var $musicBg = $('.mask_bg');

          //给获取到的元素赋值
          $musicImage.attr('src',music.cover);
          $musicName.text(music.name);
          $musicSinge.text(music.singer);
          $musicAlbum.text(music.album);
          $musicProgressName.text(music.name + ' / ' + music.singer);
          $musicProgressTime.text("00:00" + ' / ' + music.time);
          $musicBg.css('background',"url('"+music.cover+"')");

      }

      // 初始化歌词信息
      function initMusicLyric(music){
          lyric = new Lyric(music.link_lrc);
          var $lryciContainer = $('.song_lyric');
           $lryciContainer.html('');
          lyric.loadLyric(function (){
            //创建歌词列表
            $.each(lyric.lyrics,function(index,ele){
                var $item = $('<li>'+ ele +'</li>');
                $lryciContainer.append($item);
            })
          });

      }

      // 初始化进度条
      initProgress();
      function initProgress(){
       
        var $progressBar = $('.music_progress_bar');
        var $progressLine = $('.music_progress_line');
        var $progressDot = $('.music_progress_dot');
        progress = new Progress($progressBar,$progressLine,$progressDot);
        // 调用进度条按下事件
        progress.progressClick(function (value){
            console.log(value)
            player.musicSeekTo(value);
        });
        //调用进度条移动事件
        progress.progressMove(function (value){
            player.musicSeekTo(value);
            console.log(value)
        });
    
        // 创建音量模块
        var $voiceBar = $('.music_voice_bar');
        var $voiceLine = $('.music_voice_line');
        var $voiceDot = $('.music_voice_dot');
        voiceProgress = new Progress($voiceBar,$voiceLine,$voiceDot);
        // 调用音量进度条的点击事件
        voiceProgress.progressClick(function (value){
            player.musicVoiceSeekTo(value);
           
        });
        // 调用音量进度条的拖拽事件
        voiceProgress.progressMove(function (value){
            player.musicVoiceSeekTo(value);
            
        });
      }

       
    // 初始化事件监听
    initEvents();
    function initEvents(){
  //监听歌曲的移入移出事件
  $('.container_list').delegate('.list_music','mouseenter',function(){
    //显示子菜单
         
          // find找到后代元素
          $(this).find('.list_menu').stop().fadeIn(100);
          $(this).find('.list_time a').stop().fadeIn(100);
           //隐藏时长
          $(this).find('.list_time span').stop().fadeOut(100);
      })
      $('.container_list').delegate('.list_music','mouseleave',function(){
           //隐藏子菜单
          
           $(this).find('.list_menu').stop().fadeOut(100);
           $(this).find('.list_time a').stop().fadeOut(100);
           // 显示时长
           $(this).find('.list_time span').stop().fadeIn(100);
      });
      
      //选择框的切换事件
      $('.container_list').delegate('.list_check','click',function(){
           $(this).toggleClass('list_checked');
      });
  
      // 添加子菜单播放按钮
      var $musicPlay = $('.music_play');
      $('.container_list').delegate('.list_menu_play','click',function(){
          var $item = $(this).parents('.list_music');
          //切换播放图标
          $(this).toggleClass('list_menu_play2');
          //恢复其他播放按钮
          $item.siblings().find('.list_menu_play').removeClass('list_menu_play2');
          //同步底部播放按钮
          if($(this).hasClass('list_menu_play2')){
              //当前子菜单的播放按钮是播放状态
              $musicPlay.addClass('music_play2');
              //让文字高亮
              $item.find('div').css('color','#fff')
              //解决兄弟元素高亮问题
              $item.siblings().find('div').css('color','rgba(255,255,255,0.5)');
             
          }else{
              // 当前子菜单的播放按钮不是播放状态
              $musicPlay.removeClass('music_play2');
              // 让文字不高亮
              $item.find('div').css('color','rgba(255,255,255,0.5)');
              
          }
          //切换序号的状态
          $item.find('.list_number').toggleClass('list_number2');
          $item.siblings().find('.list_number').removeClass('list_number2')

          //播放音乐
          player.playMusic($item.get(0).index,$item.get(0).music);
        //   切换歌曲信息
          initMusicInfo($item.get(0).music);
          //切换歌词信息
          initMusicLyric($item.get(0).music);
        
      })
       //监听底部控制区域播放按钮的点击
          $musicPlay.click(function(){
                // 判断有没有播放过音乐
            if(player.currentIndex == -1){
                //没有播放过音乐
              
                $('.list_music').eq(0).find('.list_menu_play').trigger('click');
            }else{
                //播放过音乐
                $('.list_music').eq(player.currentIndex).find('.list_menu_play').trigger('click')
            }
          })
        //   监听底部控制区域上一首按钮的点击
        var $music_pre = $('.music_pre');
        $music_pre.click(function(){
            $('.list_music').eq(player.preIndex()).find('.list_menu_play').trigger('click')
        })
        // 监听底部控制区域下一首按钮的点击
        var $music_next = $('.music_next');
        $music_next.click(function(){
            $('.list_music').eq(player.nextIndex()).find('.list_menu_play').trigger('click')
            
        })

        //由于删除按钮是动态添加的所以需要用到事件委托
        //监听删除按钮
        $('.container_list').delegate('.list_menu_del','click',function(){
            //找到被点击的音乐
            var $item = $(this).parents('.list_music');
            // 判断当前删除的是否是正在播放的
            if($item.get(0) == player.currentIndex){
                $music_next.trigger('click');
            }
            $item.remove();
            player.changeMusic($item.get(0).index);
            //重新排序
            $('.list_music').each(function(index,ele){
                ele.index = index;
                $(ele).find('.list_number').text(index + 1);
            })

        })
        //监听播放进度
        player.musicTimeUpdate(function(currentTime,duration,timeStr){
            //同步时间
            $('.music_progress_time').text(timeStr)
            //同步进度条
            //计算播放比例
            var value = currentTime / duration * 100;
            progress.setProgress(value);

            // 实现歌词同步
            var index = lyric.currentIndex(currentTime)
            console.log(index)
            var $item =  $('.song_lyric li').eq(index);
            $item.addClass('cur')
            $item.siblings().removeClass('cur');
            //
            if(index <= 2) return;
            $('.song_lyric').css({
                marginTop: ((-index + 2) * 30)
            })
        });

        // 监听声音按钮的点击
        $('.music_voice_icon').click(function (){
            //图标的切换
            $(this).toggleClass('music_voice_icon2');
            //声音的切换
            if($(this).attr('class').indexOf('music_voice_icon2') != -1){
                // 变为没有声音
                player.musicVoiceSeekTo(0);
               
            }else{
                // 变为有声音
                player.musicVoiceSeekTo(1);
            }
        });

    }

    //定义一个方法动态创建一条音乐
    function crateMusicItem(index,music){
        var $item = $(" <li class=\"list_music\">\n" +
        "<div class=\"list_check\"><i></i></div>\n" +
        " <div class=\"list_number\">"+(index+1)+"</div>\n" +
        "<div class=\"list_name\">"+music.name+""+
        "<div class=\"list_menu\">\n"+
                "<a href=\"javascript:;\" title=\"播放\" class=\"list_menu_play\"></a>\n"+
                "<a href=\"javascript:;\" title=\"添加\"></a>\n"+
                "<a href=\"javascript:;\" title=\"下载\"></a>\n"+
                "<a href=\"javascript:;\" title=\"分享\"></a>\n"+
           " </div> \n" +
        "</div> \n"+
        "<div class=\"list_singer\">"+music.singer+"</div>\n"+
     "   <div class=\"list_time\">\n" +
            "<span>"+music.time+"</span>\n"+
            "<a href=\"javascript:;\" class='list_menu_del' title=\"删除\"></a>\n"+
        "</div>\n"+
    "</li>")
    $item.get(0).index = index;
    $item.get(0).music = music;
    return $item;
    }

    

})