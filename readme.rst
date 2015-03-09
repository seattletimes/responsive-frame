Responsive Frame
================

Defines a set of custom elements similar to `Pym.js <https://github.com/nprapps/pym.js>`__ for embedding remote content (graphics, visualizations, tables) into a CMS easily. The code defines two custom elements, ``responsive-frame`` and ``responsive-child`` and is completely configured via HTML--users do not need to know how to write JavaScript.

On the host page:

1. Include the ``responsive-frame.js`` file to load the parent element.
2. Add your responsive iframes to the page using the custom element, like so::

    <responsive-frame src="guest.html"></responsive-frame>

   You can also use the responsive-iframe extended element, if you want::

    <iframe is="responsive-iframe" src="guest.html"></iframe>

On the guest page:

1. Include the ``responsive-child.js`` file to load the child element behavior.
2. Wrap your content in a ``<responsive-child>`` tag, or extend the body tag with its behavior using the ``responsive-body`` attribute value::

    <body is="responsive-body">
      Note: previously, we extended body elements with "responsive-child", but
      this has been deprecated so that we can have both extended elements and
      individual "responsive-child"; elements.
    </body>

That's it!

Extracurricular messaging
-------------------------

Although it is intended for resizing frames, you can also transfer arbitrary messages between the host and guest via the ``sendMessage()`` method present on each. Messages received on the client side will have the ``message`` event type, and will propagate in from the ``responsive-child`` element. On the host, the message type is ``childmessage`` to avoid colliding with the existing ``message`` type, and will bubble upward from the ``responsive-frame``.

Why <responsive-frame>?
-----------------------

Why use the responsive frame component instead of, for example, NPR's Pym.js?

- <responsive-frame> communicates over JSON, which means that it can pass complex objects between windows, and its protocol is easy to extend.
- No configuration needed: because the host and guest negotiate directly during startup, much of the setup for the <responsive-frame> is done for you.
- No JavaScript needed: the component is completely instantiated and rendered through HTML, instead of requiring scripting support on both sides of the frame.
- Clean, future-forward codebase: <responsive-frame> is designed to minimize the amount of memory use and promote easy debugging through the use of standard, idiomatic JavaScript.

About this project
------------------

These custom elements are built on The Seattle Times' `component scaffolding <https://github.com/seattletimes/component-template>`__, which makes it easy to create Web Components for IE9 and greater.