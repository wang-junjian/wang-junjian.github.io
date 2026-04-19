---
layout: single
title:  "Welcome to Jekyll!"
date:   2020-10-15 12:51:46 +0800
categories: jekyll
---
You’ll find this post in your `_posts` directory. Go ahead and edit it and re-build the site to see your changes. You can rebuild the site in many different ways, but the most common way is to run `jekyll serve`, which launches a web server and auto-regenerates your site when a file is updated.

Jekyll requires blog post files to be named according to the following format:

`YEAR-MONTH-DAY-title.MARKUP`

Where `YEAR` is a four-digit number, `MONTH` and `DAY` are both two-digit numbers, and `MARKUP` is the file extension representing the format used in the file. After that, include the necessary front matter. Take a look at the source for this post to get an idea about how it works.

Jekyll also offers powerful support for code snippets:

{% highlight ruby %}
def print_hi(name)
  puts "Hi, #{name}"
end
print_hi('Tom')
#=> prints 'Hi, Tom' to STDOUT.
{% endhighlight %}

Check out the [Jekyll docs][jekyll-docs] for more info on how to get the most out of Jekyll. File all bugs/feature requests at [Jekyll’s GitHub repo][jekyll-gh]. If you have questions, you can ask them on [Jekyll Talk][jekyll-talk].

[jekyll-docs]: https://jekyllrb.com/docs/home
[jekyll-gh]:   https://github.com/jekyll/jekyll
[jekyll-talk]: https://talk.jekyllrb.com/


## macOS 运行Jekyll服务
```shell
bundle exec jekyll serve
```
[http://127.0.0.1:4000/](http://127.0.0.1:4000/)

macOS 升级到 Sonoma 14.0 后，运行 `bundle exec jekyll serve` 报错。目前采用容器运行的方式。
```shell
docker run -d --name=jekyll-with-wjjcom -p 4000:4000 --volume="$PWD:/srv/jekyll" jekyll/jekyll:4 jekyll serve
```

* [bundler cannot install commonmarker](https://stackoverflow.com/questions/58849651/bundler-cannot-install-commonmarker)


## 参考资料
* [jekyll/minima post.html](https://github.com/jekyll/minima/blob/master/_layouts/post.html)
* [jekyll/minima home.html](https://github.com/jekyll/minima/blob/master/_layouts/home.html)
* [How does Jekyll date formatting work?](https://stackoverflow.com/questions/7395520/how-does-jekyll-date-formatting-work)
* [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)
* [Algolia for Jekyll](https://community.algolia.com/jekyll-algolia/getting-started.html)
* [jekyll-theme-WuK](https://github.com/wu-kan/jekyll-theme-WuK)
* [jekyll-toc](https://github.com/allejo/jekyll-toc)
* [Jekyll 文章侧边索引导航](https://blog.lisz.ink/tech/webmaster/jekyll-toc.html)
* [Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)
* [Syntax highlighting in Jekyll: Calling on Rouge](https://www.langrsoft.com/2020/05/18/syntax-highlighting-in-jekyll-calling-on-rouge/)
* [Add syntax highlighting to your Jekyll site with Rouge](https://bnhr.xyz/2017/03/25/add-syntax-highlighting-to-your-jekyll-site-with-rouge.html)
* [Syntax Highlighting in Jekyll](https://mycyberuniverse.com/syntax-highlighting-jekyll.html)
* [Jekyll Syntax Highlighting](https://notes.kargware.com/2019/10/04/Jekyll-Syntax-Highlighting/)
* [Jekyll - Highlighting](https://jojozhuang.github.io/tutorial/jekyll-highlighting/)
