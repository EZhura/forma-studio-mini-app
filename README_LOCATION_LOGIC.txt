FORMA Studio — conditional project location update

Replace:
- static/js/brief.js

New behavior:
- Barcelona automatically saves as "Barcelona, Spain";
- Lisbon automatically saves as "Lisbon, Portugal";
- City and country field is hidden for Barcelona and Lisbon;
- City and country remains visible and required for all other locations;
- changing from Barcelona/Lisbon to another location clears the old value.
