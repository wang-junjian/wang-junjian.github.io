---
layout: page
title: 标签
permalink: /tags/
---

{% for tag in site.tags %} 
  <h2 id="{{ tag[0] }}">{{ tag[0] | join: "/" }} <span>[{{ tag[1].size }}]</span></h2>
  <ul>
    {% assign pages_list = tag[1] %}  

    {% for node in pages_list %}
        {% if node.title != null %}
        {% if group == null or group == node.group %}
            <li><a href="{{ BASE_PATH }}{{node.url}}">{{node.title}}</a></li>
        {% endif %}
        {% endif %}
    {% endfor %}
  </ul>
{% endfor %}
{% assign pages_list = nil %}
{% assign group = nil %}
