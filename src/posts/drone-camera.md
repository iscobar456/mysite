# Streaming Video From a Raspberry Pi

![The hardware I used](/img/pi-hardware.jpg)

Last summer my friend invited me to participate in a summer research project he
organized for the MAGICC lab. We were supposed to build a drone that would meet
different speed and carrying capacities. I can't remember what they were. I
don't think the drone ever got finished. Or if it was, this friend did
virtually all the work. I was studying computer science at the time and he
wanted me to build something like a first-person view, on-screen display
system—live footage from a camera on the drone with various flight-related data
overlayed on the video footage. I know nothing about the radio technology that
is typically used in such systems, but I had been learning about WebRTC, so
that's the route I chose.

I didn't get very far last summer. I looked into hardware options and their
capabilities. I decided on a Raspberry Pi Zero 2W with an Arducam camera. This
would only work when the system was in range of an accessible wifi network, but
it was good enough to start writing some code.


