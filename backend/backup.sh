#!/bin/bash

pg_dump \
-U postgres \
truck_tracking \
> backup.sql