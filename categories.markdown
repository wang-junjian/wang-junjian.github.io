---
layout: page
title: 类别
permalink: /categories/
---


{% for category in site.categories %} 
  <h2 id="{{ category[0] }}">{{ category[0] | join: "/" }} <span>[{{ category[1].size }}]</span></h2>
  <ul>
    {% assign pages_list = category[1] %}  

    {% for node in pages_list %}
        {% if node.title != null %}
        {% if group == null or group == node.group %}
            {% if page.url == node.url %}
            <li class="active"><a href="{{ BASE_PATH }}{{node.url}}" class="active">{{node.title}}</a></li>
            {% else %}
            <li><a href="{{ BASE_PATH }}{{node.url}}">{{node.title}}</a></li>
            {% endif %}
        {% endif %}
        {% endif %}
    {% endfor %}
  </ul>
{% endfor %}
{% assign pages_list = nil %}
{% assign group = nil %}
