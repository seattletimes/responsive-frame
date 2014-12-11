Responsive Frame
================

Defines a set of custom elements similar to `Pym.js <https://github.com/nprapps/pym.js>`__ for embedding remote content (graphics, visualizations, tables) into a CMS easily. The code defines two custom elements, ``responsive-frame`` and ``responsive-child`` and is completely configured via HTML--users do not need to know how to write JavaScript.

On the host page:

1. Include the ``responsive-frame.js`` file to load the parent element.
2. Add your responsive iframes to the page using the custom element, like so::

    <responsive-frame src="guest.html"></responsive-frame>

On the guest page:

1. Include the ``responsive-child.js`` file to load the child element behavior.
2. Wrap your content in a ``<responsive-child>`` tag, or extend the body tag with its behavior::

    <body is="responsive-child">...</body>

That's it!

Extracurricular messaging
-------------------------

Although it is intended for resizing frames, you can also transfer arbitrary messages between the host and guest via the ``sendMessage()`` method present on each. Messages received on the client side will have the ``message`` event type, and will propagate in from the ``responsive-child`` element. On the host, the message type is ``childmessage`` to avoid colliding with the existing ``message`` type, and will bubble upward from the ``responsive-frame``.

About this project
------------------

These custom elements are built on The Seattle Times' `component scaffolding <https://github.com/seattletimes/component-template>`__, which makes it easy to create Web Components for IE9 and greater.