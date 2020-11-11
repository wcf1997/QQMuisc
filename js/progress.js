(function (window){
    function Progress($progressBar,$progressLine,$progressDot){
        return new Progress.prototype.init($progressBar,$progressLine,$progressDot);
    }
    Progress.prototype = {
        constructor : Progress,
        init : function ($progressBar,$progressLine,$progressDot){
            this.$progressBar = $progressBar;
            this.$progressDot = $progressDot;
            this.$progressLine = $progressLine;
            
        },
        // 解决拖拽和进度条的自动增加冲突问题
        isMove : false,

        // 进度条点击模块
        progressClick : function(callback){
            var $this = this;//此时此刻的this是progress
            // 监听背景的点击
            this.$progressBar.click(function(){
                // 获取进图条背景距离窗口的默认位置
                var normalLeft = $(this).offset().left;
                //获取点击的位置距离窗口的位置
                var eventLeft = event.pageX;
                // 设置前景的宽度
                $this.$progressLine.css('width', eventLeft - normalLeft);
                // 设置小圆点的位置
                $this.$progressDot.css('left', eventLeft - normalLeft);

                // 获取当前进度条进行的比例
                var value = (eventLeft - normalLeft) / $(this).width();
                callback(value);

            })
        },
        //进度条拖拽功能
        progressMove : function(callback){
            var eventLeft;
            var $this = this;//此时此刻的this是progress
            // 获取默认背景距离窗口的位置
            var normalLeft = this.$progressBar.offset().left;
            var barWidth = this.$progressBar.width();
            //监听鼠标按下时事件
            $this.$progressBar.mousedown(function(){
            $this.isMove = true;
          
            //监听鼠标移动事件
            $(document).mousemove(function(event){
                // 获取点击的位置距离窗口的位置 
            eventLeft = event.pageX;
            // 解决进度条拖拽超出长度问题
            var offset = eventLeft - normalLeft;
            if(offset >=0 && offset <= barWidth){
              // 设置前景的宽度
              $this.$progressLine.css('width',eventLeft - normalLeft);
              // 设置小圆点的位置
              $this.$progressDot.css('left',eventLeft - normalLeft);}
            });
            // 鼠标抬起事件
            $(document).mouseup(function(){
                $(document).off('mousemove');
                 $this.isMove = false;  
                 // 计算进度条的宽度
                 var value = (eventLeft - normalLeft) / $this.$progressBar.width();
                 callback(value);
                
            })

        })
        },
        //进度条同步时间
        setProgress : function(value){
            if(this.isMove) return;
            if(value < 0 || value > 100)  return;
            this.$progressLine.css({
                width : value + '%'
            });
            this.$progressDot.css({
                left : value + '%'
            });
        }
      

    }
    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);