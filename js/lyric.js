(function (window){
    function Lyric(path){
        return new Lyric.prototype.init(path);
    }
    Lyric.prototype = {
        constructor : Lyric,
        init : function (path){
            this.path = path;
            
        },
        // 定义数组保留时间
        times : [],
        // 定义数组保留歌词
        lyrics : [],
        index : -1,
        loadLyric: function (callback){
            var $this = this;
            $.ajax({
                url : $this.path,
                dateTyep : "text",
                success : function(data){
                    // console .log(data)
                    // 加载解析完毕的歌词
                    $this.parseLyric(data)
                    callback()
                },
                error: function(e){
                    console.log(e);
                }
            });
        },
        parseLyric : function (data){
            $this = this;
            // 初始化歌曲信息
            $this.times = [];
            $this.lyrics = [];
            $this.index = -1;
    
            // 将歌词转换成数组
            var array = data.split("\n");
            //利用正则表达式格式化歌词 取出歌词事件节点 [00:00.66]
            // 括号里面的会看成一个整体加到类数组里
            var timeReg = /\[(\d*:\d*\.\d*)\]/;

            //遍历取出每一行歌词
            $.each(array,function(index,ele){
                // 处理歌词
                var lrc = ele.split(']')[1];
                // 排除空字符串
                if(lrc.length == 1) return;
                $this.lyrics.push(lrc);
                var res = timeReg.exec(ele);
                if(res == null) return;
                // 取出不带中括号的部分 
                var timeStr = res[1]; // 00:00.66
                // 转换成真数组取出分钟和秒
                var res2 = timeStr.split(':');
                var min = parseInt(res2[0]) * 60;
                var sec = parseFloat(res2[1]);
                // toFixed 保留小数，但是会转化成字符串
                var time = parseFloat(Number(min + sec).toFixed(2));
                $this.times.push(time);
                

            });
            
        },
        currentIndex : function(currentTime){
            // 当前时间比对歌词时间数组里面的最前面一个
            if(currentTime >= this.times[0]){
            this.index++ ;
            //shift 删除数组里最前面的一个元素
            this.times.shift();
            }
            return this.index;
            

        }
    }
    Lyric.prototype.init.prototype = Lyric.prototype;
    window.Lyric = Lyric;
})(window);