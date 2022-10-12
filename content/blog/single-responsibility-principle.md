+++
date = ""
draft = true
featureImage = ""
postImage = ""
title = "Single-responsibility principle"

+++
The **single-responsibility principle** (**SRP**) is a computer programming principle that states that "A module should be responsible to one, and only one, actor."[\[1\]](https://en.wikipedia.org/wiki/Single-responsibility_principle#cite_note-1) The term actor refers to a group (consisting of one or more stakeholders or users) that requires a change in the module.

As an example, consider a module that compiles and prints a report. Imagine such a module can be changed for two reasons. First, the content of the report could change. Second, the format of the report could change. These two things change for different causes. The single-responsibility principle says that these two aspects of the problem are really two separate [responsibilities](https://en.wikipedia.org/wiki/Interface_(computing) "Interface (computing)"), and should, therefore, be in separate classes or modules. It would be a bad design to [couple](https://en.wikipedia.org/wiki/Coupling_(computer_programming) "Coupling (computer programming)") two things that change for different reasons at different times.